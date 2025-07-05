// src/routes/sitemap-artists.xml/+server.ts
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

export const GET = async () => {
	const { data, error: supabaseError } = await supabase
		.from('artists')
		.select('slug')
		.order('slug', { ascending: true });

	if (supabaseError) {
		console.error('Supabase error:', supabaseError);
		throw error(500, 'Failed to fetch artist slugs');
	}

	if (!data || data.length === 0) {
		throw error(404, 'No artists found');
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data
	.map(
		({ slug }) => `
	<url>
		<loc>https://susmanga.com/artists/${slug}</loc>
	</url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
