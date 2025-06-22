import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
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

	return { grouped };
};
