// src/routes/sitemap-read-pages/[page].xml/+server.ts
import { error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/private';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

export const GET = async ({ params }) => {
	const PAGE_SIZE = 50000;
	const page = parseInt(params.page);

	if (isNaN(page) || page < 1) {
		throw error(400, 'Invalid sitemap page number');
	}

	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { data, error: supabaseError } = await supabase
		.from('pages')
		.select('manga_id, page_number, manga(slug)')
		.order('id', { ascending: true }) // Use index-friendly sort if possible
		.range(from, to);

	if (supabaseError) {
		throw error(500, supabaseError.message);
	}

	if (!data || data.length === 0) {
		throw error(404, 'No pages found');
	}

	const urls = data
		.filter((row) => row.manga?.slug)
		.map((row) => {
			const slug = row.manga.slug;
			const pageNum = row.page_number;
			return `https://susmanga.com/comic/${slug}/read?page=${pageNum}`;
		});

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
	.map(
		(url) => `
	<url>
		<loc>${url}</loc>
	</url>`
	)
	.join('')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
