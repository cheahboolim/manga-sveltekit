import { supabase } from '$lib/supabaseClient';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
    const PAGE_SIZE = 1000;
    const page = parseInt(params.page, 10);
    
    // Validate page number
    if (isNaN(page) || page < 1) {
        return new Response('Invalid page number', { status: 400 });
    }

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
        // Get read pages data - adjust query as needed
        const { data, error } = await supabase
            .from('slug_map') // or your read pages table
            .select('slug, updated_at, last_read_at') // include relevant timestamps
            .order('last_read_at', { ascending: false }) // or your preferred order
            .range(from, to);

        if (error) {
            console.error('Sitemap fetch error:', error.message);
            return new Response('Failed to generate sitemap.', { status: 500 });
        }

        if (!data || data.length === 0) {
            return new Response('Page not found', { status: 404 });
        }

        const urls = data
            .map(({ slug, updated_at, last_read_at }) => {
                // Use the most recent timestamp available
                const lastmod = last_read_at || updated_at || new Date().toISOString();
                return `<url>
                    <loc>https://susmanga.com/read/${slug}</loc>
                    <lastmod>${new Date(lastmod).toISOString()}</lastmod>
                    <changefreq>weekly</changefreq>
                    <priority>0.7</priority>
                </url>`;
            })
            .join('\n');

        const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urls}
        </urlset>`;

        return new Response(xml, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, max-age=86400' // Cache for 24 hours
            },
        });
    } catch (err) {
        console.error('Unexpected error:', err);
        return new Response('Internal Server Error', { status: 500 });
    }
};