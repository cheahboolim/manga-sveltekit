<script lang="ts">
	import RandomComics from '$lib/components/RandomComics.svelte';
	import TrafficStarsAd from '$lib/components/TrafficStarsAd.svelte';
	export let data;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	{#if data.meta.prev}
		<link rel="prev" href={data.meta.prev} />
	{/if}
	{#if data.meta.next}
		<link rel="next" href={data.meta.next} />
	{/if}
	<meta name="robots" content="noindex, follow" />
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
	<RandomComics comics={data.comics} page={data.page} total={data.total} seed={data.seed} />
	<TrafficStarsAd />
</main>