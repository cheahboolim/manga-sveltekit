// src/routes/search/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const supabase = locals.supabase;
	const query = url.searchParams.get('q')?.trim() || '';
	const page = Math.max(1, parseInt(url.searchParams.get('page') ?? '1', 10));
	const PAGE_SIZE = 10;
	const from = (page - 1) * PAGE_SIZE;
	const to = from + PAGE_SIZE - 1;

	if (!query) {
		return {
			query: '',
			comics: [],
			page: 1,
			totalPages: 1
		};
	}

	const { data: manga, error: mangaError, count } = await supabase
		.from('manga')
		.select('id, title, feature_image_url, slug_map(slug)', { count: 'exact' })
		.ilike('title', `%${query}%`)
		.range(from, to);

	if (mangaError || !manga) {
		console.error('Search error:', mangaError);
		throw error(500, 'Failed to search manga');
	}

	const comics = manga.map((m) => ({
		id: m.id,
		title: m.title,
		slug: m.slug_map?.[0]?.slug ?? '',
		featureImage: m.feature_image_url,
		author: { name: 'Unknown' }
	}));

	const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 1;

	return {
		query,
		comics,
		page,
		totalPages
	};
};
