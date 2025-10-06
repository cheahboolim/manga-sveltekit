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
	import BlueBallsAd from '$lib/components/ownads/BlueBallsAd.svelte';
	import AppInstallBanner from '$lib/components/AppInstallBanner.svelte';
	import AgeConsentBanner from '$lib/components/AgeConsentBanner.svelte';
	import AAdsBanner from '$lib/components/aads/AAdsBanner.svelte';
	import Coinpoll from '$lib/components/ownads/coinpoll.svelte'
	import GgBetAds from '$lib/components/ownads/ggbetads.svelte';
	import { captureTrackingToken } from '$lib/exoclick';
	import { trackTimeSpent } from '$lib/exoclick-tracking';

	let previousUser = null;
	let timeSpentTimer = null;
	const TIME_SPENT_THRESHOLD = 5 * 60 * 1000; // 5 minutes

	onMount(() => {
		// Capture ExoClick tracking token from URL parameters
		captureTrackingToken();

		// Track time spent on site
		let startTime = Date.now();
		timeSpentTimer = setInterval(() => {
			const elapsed = Date.now() - startTime;
			if (elapsed >= TIME_SPENT_THRESHOLD) {
				console.log('User spent significant time, tracking time spent conversion');
				trackTimeSpent();
				clearInterval(timeSpentTimer);
				timeSpentTimer = null;
			}
		}, 60000); // Check every minute

		return () => {
			unsubscribe();
			if (timeSpentTimer) {
				clearInterval(timeSpentTimer);
			}
		};
	});

	// Track page views on navigation
	afterNavigate(() => {
		trackPageView($page.url, $seo.title);
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#000000" />
	<meta name="msapplication-TileColor" content="#000000" />
	<!-- Client Hints Meta Tag for ExoClick (s.magsrv.com) -->
	<meta http-equiv="Delegate-CH" content="Sec-CH-UA https://s.magsrv.com; Sec-CH-UA-Mobile https://s.magsrv.com; Sec-CH-UA-Arch https://s.magsrv.com; Sec-CH-UA-Model https://s.magsrv.com; Sec-CH-UA-Platform https://s.magsrv.com; Sec-CH-UA-Platform-Version https://s.magsrv.com; Sec-CH-UA-Bitness https://s.magsrv.com; Sec-CH-UA-Full-Version-List https://s.magsrv.com; Sec-CH-UA-Full-Version https://s.magsrv.com;">
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
	<!-- Age Consent Banner -->
	<AgeConsentBanner />

	<MainNav />

	<!-- Top Banner Ad -->
	<main class="flex-1">
		<slot />
	</main>

	<!-- Responsive Ad Section -->
	<div class="container mx-auto px-4 py-4">
		<div class="flex flex-col lg:flex-row justify-center items-center gap-4 lg:gap-6">
			<div class="flex justify-center">
				<AAdsBanner />
			</div>
			<div class="flex justify-center">
				<Coinpoll />
			</div>
			<div class="flex justify-center">
				<GgBetAds />
			</div>
		</div>
	</div>

	<!-- App Install CTA -->
	<div class="container mx-auto px-4 py-2">
		<AppInstallBanner />
	</div>



	<Footer />
</div>
