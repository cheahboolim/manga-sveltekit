import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async () => {
	const { data, error: err } = await supabase
		.from('artists')
		.select('id, name, slug')
		.order('name', { ascending: true });

	if (err || !data) {
		throw error(500, 'Failed to fetch artists');
	}

	const grouped: Record<string, typeof data> = {};
	for (const artist of data) {
		const firstLetter = artist.name[0]?.toUpperCase() ?? '#';
		const key = /[A-Z]/.test(firstLetter) ? firstLetter : '#';
		if (!grouped[key]) grouped[key] = [];
		grouped[key].push(artist);
	}

	return {
		grouped,
		seo: {
			title: 'Browse Artists A–Z | SusManga',
			description: 'Discover manga by your favorite artists. Browse through an A–Z index of all available manga artists on SusManga.',
			canonical: 'https://susmanga.com/p/artists'
		}
	};
};
