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

    const { data, error } = await supabase
        .from('manga')
        .select('slug')
        .order('slug', { ascending: true })
        .range(from, to);

    if (error || !data) {
        return new Response('', { status: 500 });
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${data.map(({ slug }) => `
    <url>
        <loc>${BASE_URL}/comic/${slug}</loc>
    </url>`).join('\n')}
</urlset>`;

    return new Response(xml);
};