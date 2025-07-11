<script lang="ts">
	import ComicPreview from '$lib/components/ComicPreview.svelte';
	import SimilarManga from '$lib/components/SimilarManga.svelte';
	import MetaGroup from '$lib/components/MetaGroup.svelte';
	import RandomPost from '$lib/components/RandomPost.svelte';
	import TrafficStarsAd from '$lib/components/TrafficStarsAd.svelte';
	import ImageErrorRefreshButton from '$lib/components/ImageErrorRefreshButton.svelte';
	import { goto } from '$app/navigation';
	import AAdsMiddleBanner from '$lib/components/AAdsMiddleBanner.svelte'
	import AAdsBanner from '$lib/components/AAdsBanner.svelte'
	import NativeAds from '$lib/components/adsterra/NativeAds.svelte'

	export let data;
	const { slug, comic } = data;

	let featureImageError = false;

	function refreshFeatureImage() {
		goto(`/comic/${slug}`, { invalidateAll: true });
	}
</script>

<svelte:head>
	<title>{comic.title} | SusManga | Read Hentai Free</title>
	<meta name="description" content={`Read ${comic.title} on SusManga.`} />
	{#if comic.feature_image_url}
		<meta property="og:image" content={comic.feature_image_url} />
	{/if}
</svelte:head>

<main class="container mx-auto px-4 py-8">
	<div class="max-w-4xl mx-auto space-y-8">
		{#if comic.feature_image_url}
			<a href={`/comic/${slug}/read?page=1`}>
				<img
					src={comic.feature_image_url}
					alt={comic.title}
					class="w-full rounded-lg hover:opacity-90 transition"
					width="600"
					height="900"
					on:error={() => (featureImageError = true)}
				/>
			</a>
			<ImageErrorRefreshButton show={featureImageError} onRefresh={refreshFeatureImage} />
		{/if}

		<div>
			<h1 class="text-4xl font-bold mb-2">{comic.title}</h1>
			<div class="text-muted-foreground text-sm mb-4 flex items-center gap-2 flex-wrap">
				{#if comic.artists.length}
					<span class="font-semibold">Artists:</span>
					{#each comic.artists as artist}
						<a href={`/browse/artists/${artist.slug}`} class="underline hover:text-pink-500">
							{artist.name}
						</a>
					{/each}
					<span>&middot;</span>
				{/if}
				<span>{new Date(comic.publishedAt).toLocaleDateString()}</span>
			</div>

			<MetaGroup type="tags" label="Tags" items={comic.tags} />
			<MetaGroup type="groups" label="Groups" items={comic.groups} />
			<MetaGroup type="categories" label="Categories" items={comic.categories} />
			<MetaGroup type="languages" label="Languages" items={comic.languages} />
			<MetaGroup type="parodies" label="Parodies" items={comic.parodies} />
			<MetaGroup type="characters" label="Characters" items={comic.characters} />
		</div>

		<a href={`/comic/${slug}/read?page=1`} class="block mt-6">
			<button
				class="bg-[#FF1493] hover:bg-[#e01382] text-white text-lg font-bold px-6 py-3 rounded-xl shadow-lg border border-transparent w-full sm:w-auto transition"
			>
				Start Reading Manga
			</button>
		</a>

		{#if comic.previewImages.length > 0}
			<div>
				<h2 class="text-2xl font-bold mb-4">Preview</h2>
				<ComicPreview images={comic.previewImages} comicSlug={slug} />
			</div>
		{/if}
	</div>
<!-- Add spacing above the ad -->
<div class="mt-10">
	<AAdsMiddleBanner />
</div>
	<SimilarManga tagIds={comic.tags.map(tag => Number(tag.id))} currentMangaId={comic.id} />
	<AAdsBanner />
	<RandomPost comics={data.randomComics} />
	<TrafficStarsAd />
	<NativeAds	/>
</main>
