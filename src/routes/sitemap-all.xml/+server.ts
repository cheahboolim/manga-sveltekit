/* eslint-disable prettier/prettier */
// src/routes/sitemap-all.xml/+server.ts
import { error } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const GET = async () => {
	try {
		const base = 'https://susmanga.com';

		// Validate environment variables
		if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
			console.error('Missing Supabase environment variables');
			throw error(500, 'Database configuration error');
		}

		// Create Supabase client
		const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

		// Get total count of manga records
		const { count, error: countError } = await supabase
			.from('manga')
			.select('*', { count: 'exact', head: true });

		if (countError) {
			console.error('Error counting manga:', countError);
			throw error(500, 'Failed to count manga records');
		}

		// Calculate how many sitemap pages we actually need
		const PAGE_SIZE = 50000; // Same as your sitemap-manga endpoint
		const totalMangaPages = Math.max(1, Math.ceil((count || 0) / PAGE_SIZE));

		console.log(`Total manga records: ${count}, Pages needed: ${totalMangaPages}`);

		// Get current date for lastmod
		const lastmod = new Date().toISOString();

		// Generate only the sitemap pages we actually need
		const mangaSitemaps = Array.from({ length: totalMangaPages }, (_, i) => {
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
	} catch (err: unknown) {
		console.error('Error generating sitemap-all:', err);
		
		// Re-throw SvelteKit errors
		if (err && typeof err === 'object' && 'status' in err) {
			throw err;
		}
		
		throw error(500, 'Failed to generate sitemap');
	}
};