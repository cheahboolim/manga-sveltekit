/* eslint-disable prettier/prettier */
// src/routes/sitemap.xml/+server.ts
import { error } from '@sveltejs/kit';

export const GET = async () => {
	try {
		const staticSitemaps = [
			'/sitemap-tags.xml',
			'/sitemap-categories.xml',
			'/sitemap-artists.xml',
			'/sitemap-groups.xml',
			'/sitemap-languages.xml'
		];

		// TODO: Make this dynamic by counting actual manga chunks or reading from config
		const mangaSitemapCount = 10;

		const mangaSitemaps = Array.from(
			{ length: mangaSitemapCount }, 
			(_, i) => `/sitemap-manga/${i + 1}.xml`
		);

		const allSitemaps = [...staticSitemaps, ...mangaSitemaps];

		// Get current date for lastmod
		const lastmod = new Date().toISOString();

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps
	.map(
		(loc) => `	<sitemap>
		<loc>https://susmanga.com${loc}</loc>
		<lastmod>${lastmod}</lastmod>
	</sitemap>`
	)
	.join('\n')}
</sitemapindex>`;

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (err) {
		console.error('Error generating sitemap:', err);
		throw error(500, 'Failed to generate sitemap');
	}
};