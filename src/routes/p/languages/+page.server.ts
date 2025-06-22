import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data, error: err } = await supabase
		.from('languages')
		.select('id, name, slug')
		.order('name', { ascending: true });

	if (err || !data) {
		throw error(500, 'Failed to fetch languages');
	}

	const grouped: Record<string, typeof data> = {};
	for (const language of data) {
		const firstLetter = language.name[0]?.toUpperCase() ?? '#';
		const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(language);
	}

	return { grouped };
};
