// src/routes/sitemap.xml/+server.ts
import { supabase } from '$lib/supabaseClient';

const BASE_URL = 'https://susmanga.com';
const MANGA_PAGE_SIZE = 10000;

export const GET = async ({ setHeaders }) => {
	// Set proper headers
	setHeaders({
		'Content-Type': 'application/xml; charset=utf-8',
		'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
	});

	try {
		// Get total count of manga for pagination
		const { count: mangaCount, error: countError } = await supabase
			.from('slug_map')
			.select('*', { count: 'exact', head: true });

		if (countError) {
			console.error('Error counting manga:', countError);
			throw new Error('Failed to count manga');
		}

		const totalMangaPages = Math.ceil((mangaCount || 0) / MANGA_PAGE_SIZE);
		const now = new Date().toISOString();

		// Generate sitemap entries
		const sitemaps = [];

		// 1. Static pages sitemap (highest priority)
		sitemaps.push(`	<sitemap>
		<loc>${BASE_URL}/sitemap-static.xml</loc>
		<lastmod>${now.split('T')[0]}</lastmod>
	</sitemap>`);

		// 2. Browse pages sitemap (high priority)
		sitemaps.push(`	<sitemap>
		<loc>${BASE_URL}/sitemap-browse.xml</loc>
		<lastmod>${now.split('T')[0]}</lastmod>
	</sitemap>`);

		// 3. Manga sitemaps (content pages)
		for (let page = 1; page <= totalMangaPages; page++) {
			sitemaps.push(`	<sitemap>
		<loc>${BASE_URL}/sitemap-manga/${page}.xml</loc>
		<lastmod>${now.split('T')[0]}</lastmod>
	</sitemap>`);
		}

		const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.join('\n')}
</sitemapindex>`;

		return new Response(xml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		});
	} catch (error) {
		console.error('Sitemap index error:', error);
		
		// Fallback sitemap with basic structure
		const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	<sitemap>
		<loc>${BASE_URL}/sitemap-static.xml</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</sitemap>
	<sitemap>
		<loc>${BASE_URL}/sitemap-manga/1.xml</loc>
		<lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
	</sitemap>
</sitemapindex>`;

		return new Response(fallbackXml, {
			headers: {
				'Content-Type': 'application/xml; charset=utf-8'
			}
		});
	}
};