/* eslint-disable prettier/prettier */
// src/routes/sitemap-all.xml/+server.ts
import { error } from '@sveltejs/kit';

export const GET = async () => {
	try {
		const base = 'https://susmanga.com';

		// How many paginated manga sitemaps you want — adjust if you scale
		const TOTAL_MANGA_PAGES = 100; // Change as needed

		// Get current date for lastmod
		const lastmod = new Date().toISOString();

		// Generate manga sitemaps
		const mangaSitemaps = Array.from({ length: TOTAL_MANGA_PAGES }, (_, i) => {
			const page = i + 1;
			return `	<sitemap>
		<loc>${base}/sitemap-manga/${page}.xml</loc>
		<lastmod>${lastmod}</lastmod>
	</sitemap>`;
		}).join('\n');

		// Static sitemaps
		const staticSitemaps = [
			'sitemap-tags.xml',
			'sitemap-categories.xml',
			'sitemap-groups.xml',
			'sitemap-languages.xml',
			'sitemap-characters.xml',
			'sitemap-parodies.xml',
			'sitemap-artists.xml'
		];

		const staticSitemapXml = staticSitemaps.map(sitemap => 
			`	<sitemap>
		<loc>${base}/${sitemap}</loc>
		<lastmod>${lastmod}</lastmod>
	</sitemap>`
		).join('\n');

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mangaSitemaps}
${staticSitemapXml}
</sitemapindex>`;

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
			}
		});
	} catch (err) {
		console.error('Error generating sitemap-all:', err);
		throw error(500, 'Failed to generate sitemap');
	}
};