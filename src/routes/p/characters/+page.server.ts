import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data, error: err } = await supabase
		.from('characters')
		.select('id, name, slug')
		.order('name', { ascending: true });

	if (err || !data) {
		throw error(500, 'Failed to fetch characters');
	}

	const grouped: Record<string, typeof data> = {};
	for (const character of data) {
		const firstLetter = character.name[0]?.toUpperCase() ?? '#';
		const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(character);
	}

	return { grouped };
};
