import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ setHeaders, url }) => {
    // 1 year CDN cache, unless ?refresh=true
    if (setHeaders) {
        if (url?.searchParams.get('refresh') === 'true') {
            setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=0' });
        } else {
            setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400' });
        }
    }

    const { data, error: err } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (err || !data) {
        throw error(500, 'Failed to fetch categories');
    }

    const grouped: Record<string, typeof data> = {};
    for (const category of data) {
        const firstLetter = category.name[0]?.toUpperCase() ?? '#';
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(category);
    }

    return {
        grouped,
        seo: {
            title: 'Browse Categories A–Z | SusManga',
            description: 'Explore manga sorted by category — action, romance, fantasy, and more.',
            canonical: 'https://susmanga.com/p/categories'
        }
    };
};