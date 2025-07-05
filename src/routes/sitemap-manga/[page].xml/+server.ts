import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

const PAGE_SIZE = 50000;
const BASE_URL = 'https://susmanga.com';

export const GET = async ({ params }) => {
	const page = parseInt(params.page);
	if (isNaN(page) || page < 1) {
		throw error(400, 'Invalid page number');
	}

	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	const { data, error: supabaseError } = await supabase
		.from('slug_map')
		.select('slug')
		.order('slug', { ascending: true })
		.range(from, to);

	if (supabaseError) {
		console.error(supabaseError);
		throw error(500, 'Failed to fetch slugs');
	}

	if (!data || data.length === 0) {
		throw error(404, 'No slugs found');
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data
	.map(
		({ slug }) => `
	<url>
		<loc>${BASE_URL}/comic/${slug}</loc>
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
