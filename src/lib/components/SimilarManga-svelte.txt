<script lang="ts">
	import { onMount } from 'svelte';
	import { supabase } from '$lib/supabaseClient';
	import ComicGrid from './ComicGrid.svelte';

	export let tagIds: number[] = [];
	export let currentMangaId: string;

	type Manga = {
		id: string;
		title: string;
		feature_image_url: string;
	};

	type SlugMap = {
		manga_id: string;
		slug: string;
	};

	let comics: {
		id: string;
		title: string;
		slug: string;
		featureImage: string;
		author: { name: string };
	}[] = [];

	onMount(async () => {
		if (tagIds.length === 0) return;

		// Step 1: Get related manga_ids from tag IDs
		const { data: relatedIdsData, error: relatedIdsError } = await supabase
			.from('manga_tags')
			.select('manga_id')
			.in('tag_id', tagIds);

		if (relatedIdsError || !relatedIdsData) {
			console.error('Failed to fetch related manga_ids', relatedIdsError);
			return;
		}

		const relatedMangaIds = Array.from(
			new Set(relatedIdsData.map((t: { manga_id: string }) => t.manga_id))
		).filter((id) => id !== currentMangaId);

		if (relatedMangaIds.length === 0) return;

		// Step 2: Get manga details
		const { data: mangas, error: mangaError } = await supabase
			.from('manga')
			.select('id, title, feature_image_url')
			.in('id', relatedMangaIds)
			.limit(10);

		if (mangaError || !mangas) {
			console.error('Failed to fetch similar manga', mangaError);
			return;
		}

		// Step 3: Get slugs
		const { data: slugs } = await supabase
			.from('slug_map')
			.select('slug, manga_id');

		comics = mangas.map((item: Manga) => ({
			id: item.id,
			title: item.title,
			slug: slugs?.find((s: SlugMap) => s.manga_id === item.id)?.slug ?? '',
			featureImage: item.feature_image_url,
			author: { name: 'Unknown' }
		}));
	});
</script>

{#if comics.length > 0}
	<section class="mt-12">
		<h2 class="text-2xl font-bold mb-4">People Are Loving These Right Now</h2>
		<ComicGrid {comics} />
	</section>
{/if}
