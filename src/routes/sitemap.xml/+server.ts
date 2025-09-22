import { supabase } from '$lib/supabaseClient';

export const GET = async ({ setHeaders }) => {
    setHeaders({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=2592000, stale-while-revalidate=86400'
    });

    const today = new Date().toISOString().split('T')[0];
    const PAGE_SIZE = 50000;

    // Get counts for comics and pages
    const { count: comicCount } = await supabase.from('manga').select('id', { count: 'exact', head: true });
    const { count: pageCount } = await supabase.from('pages').select('id', { count: 'exact', head: true });

    const comicSitemapCount = Math.ceil((comicCount ?? 0) / PAGE_SIZE);
    const pageSitemapCount = Math.ceil((pageCount ?? 0) / PAGE_SIZE);

    const sitemaps = [
        ...Array(comicSitemapCount).fill(0).map((_, i) => `sitemap-comics-${i + 1}.xml`),
        ...Array(pageSitemapCount).fill(0).map((_, i) => `sitemap-pages-${i + 1}.xml`),
        'sitemap-artists.xml',
        'sitemap-categories.xml',
        'sitemap-tags.xml',
        'sitemap-parodies.xml',
        'sitemap-characters.xml',
        'sitemap-groups.xml',
        'sitemap-languages.xml',
        'sitemap-browse.xml'
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(loc => `
    <sitemap>
        <loc>https://susmanga.com/${loc}</loc>
        <lastmod>${today}</lastmod>
    </sitemap>`).join('\n')}
</sitemapindex>`;

    return new Response(xml);
};