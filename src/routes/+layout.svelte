<script>
	import { onMount } from 'svelte'
	import MainNav from '$lib/components/MainNav.svelte'
	import Footer from '$lib/components/Footer.svelte'
	import BannerAd from '$lib/components/adsterra/BannerAd.svelte'
	import BlueBallsAd from '$lib/components/ownads/BlueBallsAd.svelte'

	onMount(() => {
		// later: setup theme or auth if needed
	})
</script>

<svelte:head>
	<title>SusManga - Share Your Dreams</title>
	<meta name="description" content="SusManga.com - Share Your Dreams, Live Your Fantasy" />
	<meta name="theme-color" content="#000000" />
	<meta name="msapplication-TileColor" content="#000000" />
	<link rel="manifest" href="/manifest.json" />
	<link rel="icon" type="image/png" sizes="16x16" href="https://cdn.susmanga.com/favicon/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="https://cdn.susmanga.com/favicon/favicon-32x32.png" />
	<link rel="icon" href="https://cdn.susmanga.com/favicon/favicon.ico" sizes="any" />
	<link rel="apple-touch-icon" href="https://cdn.susmanga.com/favicon/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="https://cdn.susmanga.com/favicon/android-chrome-192x192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="https://cdn.susmanga.com/favicon/android-chrome-512x512.png" />
</svelte:head>

<div class="relative flex min-h-screen flex-col bg-background antialiased">
	<MainNav />

	<!-- Top Banner Ad -->
	<div class="container mx-auto px-4 py-2">
		<BannerAd />
	</div>

	<main class="flex-1">
		<slot />
	</main>

	<!-- Bottom Banner Ad -->
	<div class="container mx-auto px-4 py-2">
		<BlueBallsAd />
	</div>

	<Footer />
</div>
