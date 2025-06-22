// src/lib/seo.ts
import { writable } from 'svelte/store';

export const seo = writable({
	title: 'SusManga - Share Your Dreams',
	description: 'SusManga.com - Share Your Dreams, Live Your Fantasy',
	canonical: 'https://susmanga.com'
});
