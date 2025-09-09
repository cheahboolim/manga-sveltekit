// src/routes/404/+page.server.ts
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
	const RECOMMENDED_COUNT = 12;
	const randomSeed = Math.floor(Math.random() * 1000000);

	// Try to use the RPC function for seeded random
	const { data: recommendedManga, error: recommendedError } = await supabase
		.rpc('get_random_manga', {
			seed_value: randomSeed / 1000000,
			limit_count: RECOMMENDED_COUNT,
			offset_count: 0
		});

	// Fallback if RPC doesn't exist
	let fallbackRecommendedManga: MangaItem[] = [];
	if (recommendedError || !recommendedManga) {
		console.log('RPC not available, falling back to simple random for 404 page');
		const { data: fallback, error: fallbackError } = await supabase
			.from('manga')
			.select('id, title, feature_image_url')
			.limit(RECOMMENDED_COUNT * 2); // Get more to shuffle from

		if (fallbackError || !fallback) {
			console.error('Error fetching recommended manga:', fallbackError);
			fallbackRecommendedManga = [];
		} else {
			// Shuffle the results client-side
			fallbackRecommendedManga = fallback
				.map(item => ({ ...item, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.slice(0, RECOMMENDED_COUNT)
				.map(({ sort, ...item }) => item);
		}
	}

	const finalRecommendedManga: MangaItem[] = recommendedManga || fallbackRecommendedManga;

	// Get slugs for the recommended manga
	const mangaIds = finalRecommendedManga.map((m: MangaItem) => m.id);
	let recommendedComics: ComicItem[] = [];
	
	if (mangaIds.length > 0) {
		const { data: slugs, error: slugError } = await supabase
			.from('slug_map')
			.select('slug, manga_id')
			.in('manga_id', mangaIds);

		if (!slugError && slugs) {
			// Combine manga with slugs
			recommendedComics = finalRecommendedManga.map((item: MangaItem) => ({
				id: item.id,
				title: item.title,
				slug: (slugs as SlugItem[]).find((s) => s.manga_id === item.id)?.slug ?? '',
				featureImage: item.feature_image_url,
				author: { name: 'Unknown' }
			}));
		}
	}

	return {
		recommendedComics,
		meta: {
			title: 'Manga Not Found | Read Hentai',
			description: 'The manga you were looking for has been removed. Discover other popular manga and doujinshi on Read Hentai.'
		}
	} as const;
};