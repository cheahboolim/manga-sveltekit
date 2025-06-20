/* eslint-disable prettier/prettier */
// src/routes/browse/[type]/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, url }) => {
	const { type, slug } = params;
	const page = Number(url.searchParams.get('page')) || 1;
	const PAGE_SIZE = 10;
	const offset = (page - 1) * PAGE_SIZE;

	// Maps "tags" => "manga_tags", etc.
	const allowed: Record<string, string> = {
		tags: 'manga_tags',
		artists: 'manga_artists',
		categories: 'manga_categories',
		parodies: 'manga_parodies',
		characters: 'manga_characters',
		languages: 'manga_languages',
		groups: 'manga_groups'
	};

	if (!(type in allowed)) {
		throw error(404, 'Invalid browse type');
	}

	const joinTable = allowed[type];
	const idField = type.endsWith('ies')
		? type.slice(0, -3) + 'y_id'
		: type.slice(0, -1) + '_id';

	// 1. Fetch the meta tag/category/language/etc. info
	const { data: meta, error: metaErr } = await supabase
		.from(type)
		.select('id, name')
		.eq('slug', slug)
		.single();

	if (metaErr || !meta) {
		throw error(404, 'Browse category not found');
	}

	// 2. Count total manga for pagination
	const { count: total, error: countErr } = await supabase
		.from(joinTable)
		.select('manga_id', { count: 'exact', head: true })
		.eq(idField, meta.id);

	if (countErr) throw error(500, 'Failed to count related manga');

	const totalPages = Math.ceil((total || 0) / PAGE_SIZE);

	// 3. Get paginated manga IDs
	const { data: rel, error: relErr } = await supabase
		.from(joinTable)
		.select('manga_id')
		.eq(idField, meta.id)
		.order('manga_id')
		.range(offset, offset + PAGE_SIZE - 1);

	if (relErr || !rel?.length) {
		throw error(404, 'No manga found for this page');
	}

	const mangaIds = rel.map((r) => r.manga_id);

	// 4. Fetch manga data
	const { data: manga, error: mangaErr } = await supabase
		.from('manga')
		.select('id, title, feature_image_url')
		.in('id', mangaIds);

	if (mangaErr || !manga) {
		throw error(500, 'Failed to fetch manga data');
	}

	// 5. Fetch slug mappings
	const { data: slugs, error: slugErr } = await supabase
		.from('slug_map')
		.select('slug, manga_id')
		.in('manga_id', mangaIds);

	if (slugErr || !slugs) {
		throw error(500, 'Failed to fetch slug mappings');
	}

	// 6. Map manga and slugs into final result
	const comics = manga.map((item) => ({
		id: item.id,
		title: item.title,
		slug: slugs.find((s) => s.manga_id === item.id)?.slug ?? '',
		featureImage: item.feature_image_url,
		author: { name: 'Unknown' }
	}));

	return {
		type,
		slug,
		name: meta.name,
		comics,
		page,
		totalPages
	};
};
