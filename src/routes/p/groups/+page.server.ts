import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ url, setHeaders }) => {
    // 1 year CDN cache, unless ?refresh=true
    if (setHeaders) {
        if (url?.searchParams.get('refresh') === 'true') {
            setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=0' });
        } else {
            setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400' });
        }
    }

    const { data, error: err } = await supabase
        .from('groups')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (err || !data) {
        throw error(500, 'Failed to fetch groups');
    }

    const grouped: Record<string, typeof data> = {};
    for (const group of data) {
        const firstLetter = group.name[0]?.toUpperCase() ?? '#';
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(group);
    }

    return {
        grouped,
        seo: {
            title: 'Browse Groups A–Z | SusManga',
            description: 'Explore manga scanlation groups on SusManga sorted from A to Z. Discover your favorite teams and their releases.',
            canonical: `https://susmanga.com${url.pathname}`
        }
    };
};