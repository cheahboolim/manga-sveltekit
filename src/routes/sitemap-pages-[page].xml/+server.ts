import { supabase } from '$lib/supabaseClient';

const PAGE_SIZE = 50000;
const BASE_URL = 'https://susmanga.com';

export const GET = async ({ params, setHeaders }) => {
    const page = parseInt(params.page, 10) || 1;
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    setHeaders({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=0, s-maxage=2592000, stale-while-revalidate=86400'
    });

    // Get page records
    const { data: pages, error } = await supabase
        .from('pages')
        .select('manga_id, page_number')
        .order('manga_id', { ascending: true })
        .order('page_number', { ascending: true })
        .range(from, to);

    if (error || !pages || pages.length === 0) {
        return new Response('', { status: 500 });
    }

    // Get unique manga_ids for this batch
    const mangaIds = [...new Set(pages.map(p => p.manga_id))];

    // Get slugs for these manga_ids
    const { data: mangaData, error: mangaError } = await supabase
        .from('manga')
        .select('id, slug')
        .in('id', mangaIds);

    if (mangaError || !mangaData) {
        return new Response('', { status: 500 });
    }

    const mangaSlugMap = Object.fromEntries(mangaData.map(m => [m.id, m.slug]));

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(({ manga_id, page_number }) => {
    const slug = mangaSlugMap[manga_id];
    return slug
        ? `	<url>
        <loc>${BASE_URL}/comic/${slug}/${page_number}</loc>
    </url>`
        : '';
}).join('\n')}
</urlset>`;

    return new Response(xml);
};