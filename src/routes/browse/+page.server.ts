// src/routes/browse/+page.server.ts
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

export const load: PageServerLoad = async () => {
	const POPULAR_COUNT = 12;
	const randomSeed = Math.floor(Math.random() * 1000000);

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
		console.log('RPC not available, falling back to simple random for browse page');
		const { data: fallback, error: fallbackError } = await supabase
			.from('manga')
			.select('id, title, feature_image_url')
			.limit(POPULAR_COUNT * 2); // Get more to shuffle from

		if (fallbackError || !fallback) {
			console.error('Error fetching popular manga:', fallbackError);
			fallbackPopularManga = [];
		} else {
			// Shuffle the results client-side
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
		const { data: slugs, error: slugError } = await supabase
			.from('slug_map')
			.select('slug, manga_id')
			.in('manga_id', mangaIds);

		if (!slugError && slugs) {
			// Combine manga with slugs
			popularComics = finalPopularManga.map((item: MangaItem) => ({
				id: item.id,
				title: item.title,
				slug: (slugs as SlugItem[]).find((s) => s.manga_id === item.id)?.slug ?? '',
				featureImage: item.feature_image_url,
				author: { name: 'Unknown' }
			}));
		}
	}

	return {
		popularComics,
		meta: {
			title: 'Browse Manga | Read Hentai',
			description: 'Browse manga by tags, artists, parodies, characters, groups, categories, and languages. Discover your favorite hentai and doujinshi on Read Hentai.'
		}
	} as const;
};