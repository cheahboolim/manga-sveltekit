// src/routes/sitemap-static.xml/+server.ts
const BASE_URL = 'https://susmanga.com';

export const GET = async ({ setHeaders }) => {
	setHeaders({
		'Content-Type': 'application/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=86400'
	});

	const now = new Date().toISOString().split('T')[0];

	// Define your static pages with their importance and update frequency
	const staticPages = [
		{
			url: '',
			lastmod: now,
			changefreq: 'daily',
			priority: '1.0'
		},
		{
			url: '/browse',
			lastmod: now,
			changefreq: 'daily',
			priority: '0.9'
		},
		{
			url: '/p/tags',
			lastmod: now,
			changefreq: 'weekly',
			priority: '0.9'
		},
		{
			url: '/p/parodies',
			lastmod: now,
			changefreq: 'weekly',
			priority: '0.9'
		},
		{
			url: '/p/artists',
			lastmod: now,
			changefreq: 'weekly',
			priority: '0.8'
		},
		{
			url: '/p/characters',
			lastmod: now,
			changefreq: 'weekly',
			priority: '0.8'
		},
		{
			url: '/p/categories',
			lastmod: now,
			changefreq: 'weekly',
			priority: '0.8'
		},
		{
			url: '/p/languages',
			lastmod: now,
			changefreq: 'monthly',
			priority: '0.7'
		},
		{
			url: '/p/groups',
			lastmod: now,
			changefreq: 'monthly',
			priority: '0.7'
		}
	];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages
	.map(({ url, lastmod, changefreq, priority }) => `	<url>
		<loc>${BASE_URL}${url}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`)
	.join('\n')}
</urlset>`;

	return new Response(xml);
};