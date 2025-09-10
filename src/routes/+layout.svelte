<script>
	import '$app/environment';
	import '../app.css';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { seo } from '$lib/seo';
	import { trackPageView } from '$lib/gtm.js';

	import MainNav from '$lib/components/MainNav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import BannerAd from '$lib/components/adsterra/BannerAd.svelte';
	import BlueBallsAd from '$lib/components/ownads/BlueBallsAd.svelte';
	import AppInstallBanner from '$lib/components/AppInstallBanner.svelte';
	import AAdsBanner from '$lib/components/AAdsBanner.svelte';
	import ExoClickSlider from '$lib/components/ExoClickSlider.svelte';
	import ExoOutstreamAd from '$lib/components/ExoOutstreamAd.svelte';
	import Coinpoll from '$lib/components/ownads/coinpoll.svelte'
	import IframeAd from '$lib/trafficstars/IframeAd.svelte'

	onMount(() => {
		// Future setup: theme, auth, etc.
	});

	// Track page views on navigation
	afterNavigate(() => {
		trackPageView($page.url, $seo.title);
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#000000" />
	<meta name="msapplication-TileColor" content="#000000" />
	<link rel="manifest" href="/manifest.webmanifest" />

	<!-- Favicons -->
	<link rel="icon" type="image/png" sizes="16x16" href="https://cdn.susmanga.com/favicon/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="https://cdn.susmanga.com/favicon/favicon-32x32.png" />
	<link rel="icon" href="https://cdn.susmanga.com/favicon/favicon.ico" sizes="any" />
	<link rel="apple-touch-icon" href="https://cdn.susmanga.com/favicon/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="https://cdn.susmanga.com/favicon/android-chrome-192x192.png" />
	<link rel="icon" type="image/png" sizes="512x512" href="https://cdn.susmanga.com/favicon/android-chrome-512x512.png" />
</svelte:head>

<!-- Root wrapper -->
<div class="relative flex min-h-screen flex-col bg-background text-foreground antialiased">
	<MainNav />

	<!-- Top Banner Ad -->
	<div class="container mx-auto px-4 py-2 flex justify-center">
		<Coinpoll />
	</div>

	<main class="flex-1">
		<slot />
	</main>

	<!-- Mid Banner Ad -->
	<div class="container mx-auto px-4 py-2">
		<AAdsBanner />
	</div>

	<!-- Bottom Banner Ad -->
	<div class="container mx-auto px-4 py-2">
		<IframeAd />
	</div>

	<!-- App Install CTA -->
	<div class="container mx-auto px-4 py-2">
		<AppInstallBanner />
	</div>

	<Footer />

	<!-- Video Slider Ads (full width, no container to avoid breaking layout) -->
	<ExoClickSlider />
	<ExoOutstreamAd />
</div>
