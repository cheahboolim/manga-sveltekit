// src/routes/sitemap-browse.xml/+server.ts
import { supabase } from '$lib/supabaseClient';

const BASE_URL = 'https://susmanga.com';

export const GET = async ({ setHeaders }) => {
	setHeaders({
		'Content-Type': 'application/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=86400'
	});

	try {
		const browseUrls = [];
		const now = new Date().toISOString().split('T')[0];

		// Define browse types with their priorities
		const browseTypes = [
			{ table: 'tags', priority: '0.9', changefreq: 'weekly' },
			{ table: 'parodies', priority: '0.8', changefreq: 'weekly' },
			{ table: 'artists', priority: '0.8', changefreq: 'monthly' },
			{ table: 'characters', priority: '0.7', changefreq: 'monthly' },
			{ table: 'categories', priority: '0.7', changefreq: 'monthly' },
			{ table: 'languages', priority: '0.6', changefreq: 'yearly' },
			{ table: 'groups', priority: '0.6', changefreq: 'monthly' }
		];

		// Fetch browse pages for each type
		for (const { table, priority, changefreq } of browseTypes) {
			const { data, error } = await supabase
				.from(table)
				.select('slug')
				.order('name', { ascending: true })
				.limit(1000); // Limit to most important ones

			if (error) {
				console.error(`Error fetching ${table}:`, error);
				continue;
			}

			if (data) {
				for (const item of data) {
					if (item.slug) {
						browseUrls.push({
							url: `/browse/${table}/${item.slug}`,
							lastmod: now,
							changefreq,
							priority
						});
					}
				}
			}
		}

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${browseUrls
	.map(({ url, lastmod, changefreq, priority }) => `	<url>
		<loc>${BASE_URL}${url}</loc>
		<lastmod>${lastmod}</lastmod>
		<changefreq>${changefreq}</changefreq>
		<priority>${priority}</priority>
	</url>`)
	.join('\n')}
</urlset>`;

		return new Response(xml);
	} catch (error) {
		console.error('Browse sitemap error:', error);
		
		// Return minimal sitemap on error
		const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<url>
		<loc>${BASE_URL}/browse</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
		<changefreq>daily</changefreq>
		<priority>0.9</priority>
	</url>
</urlset>`;

		return new Response(fallbackXml);
	}
};