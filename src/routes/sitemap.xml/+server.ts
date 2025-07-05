// src/routes/sitemap.xml/+server.ts
import { error } from '@sveltejs/kit';

export const GET = async () => {
	const staticSitemaps = [
		'/sitemap-tags.xml',
		'/sitemap-categories.xml',
		'/sitemap-artists.xml',
		'/sitemap-groups.xml',
		'/sitemap-languages.xml'
	];

	const mangaSitemapCount = 10; // Update this based on how many chunks you’ve split (50,000 slugs per file)

	const mangaSitemaps = Array.from({ length: mangaSitemapCount }, (_, i) => `/sitemap-manga/${i + 1}.xml`);

	const allSitemaps = [...staticSitemaps, ...mangaSitemaps];

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allSitemaps
	.map(
		(loc) => `
	<sitemap>
		<loc>https://susmanga.com${loc}</loc>
	</sitemap>`
	)
	.join('\n')}
</sitemapindex>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
