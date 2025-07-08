<script lang="ts">
	import AAdsMiddleBanner from '$lib/components/AAdsMiddleBanner.svelte'
	import RandomHome from '$lib/components/RandomHome.svelte';
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
	<!-- Homepage should be indexed -->
	<meta name="robots" content="index, follow" />
	
	<!-- Open Graph tags for social sharing -->
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://cdn.susmanga.com/main/susmanga-home.jpg" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:url" content="https://s.susmanga.com" />
	<meta property="og:site_name" content="SusManga" />
	
	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:image" content="https://cdn.susmanga.com/main/susmanga-home.jpg" />
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
	<RandomHome comics={data.comics} page={data.page} total={data.total} seed={data.seed} />

	<AAdsMiddleBanner />

	<TrafficStarsAd />
</main>