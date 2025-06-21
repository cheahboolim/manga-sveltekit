<script lang="ts">
	import LatestComics from '$lib/components/LatestComics.svelte';
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
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
	<LatestComics comics={data.comics} page={data.page} total={data.total} />
</main>
