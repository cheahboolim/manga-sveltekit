import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ url }) => {
	const PAGE_SIZE = 20;

	const pageParam = parseInt(url.searchParams.get('page') ?? '1', 10);
	const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	// Fetch manga
	const { data: manga, error: mangaError, count } = await supabase
		.from('manga')
		.select('id, title, feature_image_url', { count: 'exact' })
		.order('created_at', { ascending: false })
		.range(from, to);

	if (mangaError || !manga) {
		console.error('Error fetching manga:', mangaError);
		throw new Error('Failed to load manga');
	}

	// Get slugs
	const mangaIds = manga.map((m) => m.id);
	const { data: slugs, error: slugError } = await supabase
		.from('slug_map')
		.select('slug, manga_id')
		.in('manga_id', mangaIds);

	if (slugError || !slugs) {
		console.error('Error fetching slugs:', slugError);
		throw new Error('Failed to load slugs');
	}

	// Combine
	const comics = manga.map((item) => ({
		id: item.id,
		title: item.title,
		slug: slugs.find((s) => s.manga_id === item.id)?.slug ?? '',
		featureImage: item.feature_image_url,
		author: { name: 'Unknown' }
	}));

	const total = count ?? 0;
	const totalPages = Math.ceil(total / PAGE_SIZE);
	const isFirstPage = page === 1;

	return {
		comics,
		total,
		page,
		meta: {
			title: isFirstPage
				? 'SusManga | Read Hentai, Doujinshi, and Lastest Manga'
				: `Latest Manga Updates | Page ${page} | SusManga`,
			description: isFirstPage
				? 'Read the latest updated manga on SusManga. Nhentai, doujinshi, rule34, alternative and more.'
				: `Read page ${page} of the latest manga updates on SusManga. Browse fresh adult comics for your enjoyment.`,
			prev: page > 1 ? `/?page=${page - 1}` : null,
			next: page < totalPages ? `/?page=${page + 1}` : null
		}
	};
};
