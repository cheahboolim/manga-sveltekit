import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ url }) => {
	const { data, error: err } = await supabase
		.from('groups')
		.select('id, name, slug')
		.order('name', { ascending: true });

	if (err || !data) {
		throw error(500, 'Failed to fetch groups');
	}

	const grouped: Record<string, typeof data> = {};
	for (const group of data) {
		const firstLetter = group.name[0]?.toUpperCase() ?? '#';
		const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(group);
	}

	return {
		grouped,
		canonicalUrl: `https://susmanga.com${url.pathname}`
	};
};
