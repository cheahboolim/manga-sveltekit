import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

interface MangaItem {
    id: number;
    title: string;
    feature_image_url: string;
}

interface SlugItem {
    slug: string;
    manga_id: number;
}

interface ComicItem {
    id: number;
    title: string;
    slug: string;
    featureImage: string;
    author: { name: string };
}

export const load: PageServerLoad = async ({ url, setHeaders }) => {
    const POPULAR_COUNT = 12;
    const randomSeed = Math.floor(Math.random() * 1000000);

    // 1 year CDN cache, unless ?refresh=true
    if (url.searchParams.get('refresh') === 'true') {
        setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=0' });
    } else {
        setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400' });
    }

    // Try to use the RPC function for seeded random
    const { data: popularManga, error: popularError } = await supabase
        .rpc('get_random_manga', {
            seed_value: randomSeed / 1000000,
            limit_count: POPULAR_COUNT,
            offset_count: 0
        });

    // Fallback if RPC doesn't exist
    let fallbackPopularManga: MangaItem[] = [];
    if (popularError || !popularManga) {
        const { data: fallback, error: fallbackError } = await supabase
            .from('manga')
            .select('id, title, feature_image_url')
            .limit(POPULAR_COUNT * 2);

        if (fallbackError || !fallback) {
            fallbackPopularManga = [];
        } else {
            fallbackPopularManga = fallback
                .map(item => ({ ...item, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .slice(0, POPULAR_COUNT)
                .map(({ sort, ...item }) => item);
        }
    }

    const finalPopularManga: MangaItem[] = popularManga || fallbackPopularManga;

    // Get slugs for the popular manga
    const mangaIds = finalPopularManga.map((m: MangaItem) => m.id);
    let popularComics: ComicItem[] = [];
    
    if (mangaIds.length > 0) {
        const { data: slugs } = await supabase
            .from('slug_map')
            .select('slug, manga_id')
            .in('manga_id', mangaIds);

        popularComics = finalPopularManga.map((item: MangaItem) => ({
            id: item.id,
            title: item.title,
            slug: (slugs as SlugItem[]).find((s) => s.manga_id === item.id)?.slug ?? '',
            featureImage: item.feature_image_url,
            author: { name: 'Unknown' }
        }));
    }

    // SEO meta
    const canonicalUrl = 'https://readhentai.me/browse';
    const ogImage = `${process.env.PUBLIC_CDN_BASE_URL || 'https://cdn.susmanga.com'}/main/Read Hentai-home.jpg`;
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Browse Manga | Read Hentai",
        "description": "Browse manga by tags, artists, parodies, characters, groups, categories, and languages. Discover your favorite hentai and doujinshi on Read Hentai.",
        "url": canonicalUrl,
        "image": ogImage,
        "mainEntity": popularComics.map((comic) => ({
            "@type": "ComicSeries",
            "name": comic.title,
            "url": `https://readhentai.me/comic/${comic.slug}`,
            "image": comic.featureImage
        }))
    };

    return {
        popularComics,
        meta: {
            title: 'Browse Manga | Read Hentai',
            description: 'Browse manga by tags, artists, parodies, characters, groups, categories, and languages. Discover your favorite hentai and doujinshi on Read Hentai.',
            canonical: canonicalUrl,
            ogImage,
            jsonLd
        }
    } as const;
};