// src/routes/sitemap-tags.xml/+server.ts
import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';

export const GET = async () => {
	const { data, error: supabaseError } = await supabase
		.from('tags')
		.select('slug')
		.order('slug', { ascending: true });

	if (supabaseError) {
		console.error('Supabase error:', supabaseError);
		throw error(500, 'Failed to fetch tag slugs');
	}

	if (!data || data.length === 0) {
		throw error(404, 'No tags found');
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data
	.map(
		({ slug }) => `
	<url>
		<loc>https://susmanga.com/tags/${slug}</loc>
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
