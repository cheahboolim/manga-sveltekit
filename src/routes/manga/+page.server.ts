import { supabase } from '$lib/supabaseClient';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? 1);
	const limit = 50;
	const searchTerm = url.searchParams.get('search') ?? '';
	const tagFilter = url.searchParams.get('tag') ?? '';

	const from = (page - 1) * limit;
	const to = page * limit - 1;

	let mangaQuery;
	const queryBuilder = supabase.from('manga');

	if (tagFilter) {
		mangaQuery = queryBuilder
			.select('id, title, feature_image_url, manga_tags!inner(tag_id)', { count: 'exact' })
			.eq('manga_tags.tag_id', tagFilter);
	} else {
		mangaQuery = queryBuilder.select('id, title, feature_image_url', { count: 'exact' });
	}

	if (searchTerm) {
		mangaQuery = mangaQuery.ilike('title', `%${searchTerm}%`);
	}

	const { data: manga, error: mangaError, count } = await mangaQuery
		.order('created_at', { ascending: false })
		.range(from, to);

	if (mangaError) {
		console.error('Error fetching manga:', mangaError);
		return fail(500, { message: 'Could not fetch manga posts. Check server logs for details.' });
	}

	const { data: tags, error: tagsError } = await supabase
		.from('tags')
		.select('id, name')
		.order('name', { ascending: true });

	if (tagsError) {
		console.error('Error fetching tags:', tagsError);
		return fail(500, { message: 'Could not fetch tags.' });
	}

	return {
		manga: manga ?? [],
		count: count ?? 0,
		page,
		limit,
		tags: tags ?? []
	};
};

export const actions: Actions = {
	deletePost: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		if (!id) return fail(400, { message: 'Invalid request, post ID is missing.' });
		const { error } = await supabase.from('manga').delete().eq('id', id);
		if (error) return fail(500, { message: `Failed to delete post: ${error.message}` });
		return { success: true, message: 'Post deleted successfully.' };
	},
	deleteSelected: async ({ request }) => {
		const formData = await request.formData();
		const idsToDelete = (formData.get('selectedIds') as string)?.split(',');
		if (!idsToDelete || idsToDelete.length === 0)
			return fail(400, { message: 'No posts selected.' });
		const { error } = await supabase.from('manga').delete().in('id', idsToDelete);
		if (error) return fail(500, { message: `Failed to delete selected posts: ${error.message}` });
		return { success: true, message: 'Selected posts deleted.' };
	},
	updatePost: async ({ request }) => {
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		if (!id || !title) return fail(400, { message: 'Invalid request, ID or title is missing.' });
		const { error } = await supabase.from('manga').update({ title }).eq('id', id);
		if (error) return fail(500, { message: `Failed to update post: ${error.message}` });
		return { success: true, message: 'Post updated successfully.' };
	}
};