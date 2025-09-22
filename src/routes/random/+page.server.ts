import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ url }) => {
	// Set CDN cache for 5 minutes
	const setHeaders = arguments[0]?.setHeaders;
	setHeaders?.({
		'Cache-Control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=60'
	});
	const PAGE_SIZE = 20;

	const pageParam = parseInt(url.searchParams.get('page') ?? '1', 10);
	const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
	const refreshParam = url.searchParams.get('refresh');
	const seedParam = url.searchParams.get('seed');

		// Always generate a new seed for each cache refresh to ensure different manga
		let seed: number;
		if (refreshParam === 'true' || !seedParam) {
			seed = Math.floor(Math.random() * 1000000);
		} else {
			seed = Math.floor(Math.random() * 1000000);
		}

	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	// First, get the total count for pagination
	const { count: totalCount, error: countError } = await supabase
		.from('manga')
		.select('*', { count: 'exact', head: true });

	if (countError) {
		console.error('Error getting manga count:', countError);
		throw new Error('Failed to load manga count');
	}

	// Use seeded random with PostgreSQL
	// Note: This uses PostgreSQL's setseed() function for consistent random ordering
	const { data: manga, error: mangaError } = await supabase
		.rpc('get_random_manga', {
			seed_value: seed / 1000000, // PostgreSQL setseed expects value between 0 and 1
			limit_count: PAGE_SIZE,
			offset_count: from
		});

	// Fallback if RPC doesn't exist - use simple random (less consistent across pages)
	let fallbackManga;
	if (mangaError || !manga) {
		console.log('RPC not available, falling back to simple random');
		const { data: fallback, error: fallbackError } = await supabase
			.from('manga')
			.select('id, title, feature_image_url')
			.range(from, to);

		if (fallbackError || !fallback) {
			console.error('Error fetching manga:', fallbackError);
			throw new Error('Failed to load manga');
		}

		// Shuffle the results client-side (less ideal but works)
		fallbackManga = fallback
			.map(item => ({ ...item, sort: Math.random() }))
			.sort((a, b) => a.sort - b.sort)
			.map(({ sort, ...item }) => item);
	}

	const finalManga = manga || fallbackManga;

	// Get slugs for the manga
	const mangaIds = finalManga.map((m: any) => m.id);
	const { data: slugs, error: slugError } = await supabase
		.from('slug_map')
		.select('slug, manga_id')
		.in('manga_id', mangaIds);

	if (slugError || !slugs) {
		console.error('Error fetching slugs:', slugError);
		throw new Error('Failed to load slugs');
	}

	// Combine manga with slugs
	const comics = finalManga.map((item: any) => ({
		id: item.id,
		title: item.title,
		slug: slugs.find((s) => s.manga_id === item.id)?.slug ?? '',
		featureImage: item.feature_image_url,
		author: { name: 'Unknown' }
	}));

	const total = totalCount ?? 0;
	const totalPages = Math.ceil(total / PAGE_SIZE);
	const isFirstPage = page === 1;

	return {
		comics,
		total,
		page,
		seed, // Include seed for consistent pagination
		meta: {
			title: isFirstPage
				? 'Random Manga | Discover New Comics | SusManga'
				: `Random Manga | Page ${page} | SusManga`,
			description: isFirstPage
				? 'Discover random manga and doujinshi on SusManga. Find new comics you might have missed!'
				: `Browse page ${page} of random manga selections. Discover new adult comics randomly.`,
			prev: page > 1 ? `/random?page=${page - 1}&seed=${seed}` : null,
			next: page < totalPages ? `/random?page=${page + 1}&seed=${seed}` : null
		}
	};
};