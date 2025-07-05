// src/routes/sitemap-all.xml/+server.ts
import { error } from '@sveltejs/kit';

export const GET = async () => {
	const base = 'https://susmanga.com';

	// How many paginated manga sitemaps you want — adjust if you scale
	const TOTAL_MANGA_PAGES = 100; // Change as needed

	const mangaSitemaps = Array.from({ length: TOTAL_MANGA_PAGES }, (_, i) => {
		const page = i + 1;
		return `
	<sitemap>
		<loc>${base}/sitemap-manga/${page}.xml</loc>
	</sitemap>`;
	}).join('\n');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${mangaSitemaps}
	<sitemap><loc>${base}/sitemap-tags.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-categories.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-groups.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-languages.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-characters.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-parodies.xml</loc></sitemap>
	<sitemap><loc>${base}/sitemap-artists.xml</loc></sitemap>
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
