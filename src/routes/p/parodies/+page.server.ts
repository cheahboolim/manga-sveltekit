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
        .from('languages')
        .select('id, name, slug')
        .order('name', { ascending: true });

    if (err || !data) {
        throw error(500, 'Failed to fetch languages');
    }

    const grouped: Record<string, typeof data> = {};
    for (const lang of data) {
        const firstLetter = lang.name[0]?.toUpperCase() ?? '#';
        const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(lang);
    }

    return {
        grouped,
        seo: {
            title: 'Languages – Browse by Language | SusManga',
            description: 'Explore manga by language on SusManga. Browse your favorite content in English, Japanese, and more.',
            canonical: 'https://susmanga.com/p/languages'
        }
    };
};