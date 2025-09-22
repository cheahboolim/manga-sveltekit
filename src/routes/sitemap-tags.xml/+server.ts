import { supabase } from '$lib/supabaseClient';

export const GET = async ({ setHeaders }) => {
	setHeaders({
		'Content-Type': 'application/xml',
		'Cache-Control': 'public, max-age=0, s-maxage=2592000, stale-while-revalidate=86400'
	});

	const { data, error } = await supabase
		.from('tags')
		.select('slug')
		.order('slug', { ascending: true });

	if (error || !data) {
		return new Response('', { status: 500 });
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data.map(({ slug }) => `
	<url>
		<loc>https://susmanga.com/tags/${slug}</loc>
	</url>`).join('\n')}
</urlset>`;

	return new Response(xml);
};
