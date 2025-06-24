<script>
	import { onMount } from 'svelte';

	let adLoaded = false;

	onMount(() => {
		if (adLoaded) return;

		// Optionally block this on mobile
		// if (window.innerWidth < 768) return;

		// Inject the stylesheet
		const link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = '//cdn.tsyndicate.com/sdk/v1/interstitial.ts.css';
		document.head.appendChild(link);

		// Inject the JS script
		const script = document.createElement('script');
		script.src = '//cdn.tsyndicate.com/sdk/v1/interstitial.ts.js';
		script.async = true;

		script.onload = () => {
			if (window.InterstitialTsAd) {
				window.InterstitialTsAd({
					spot: '9b612090edba4411bb22274d550c811a',
					extid: '', // Replace with dynamic user/session ID if needed
				});
				adLoaded = true;
			}
		};

		document.body.appendChild(script);
	});
</script>

<!-- You don't need a container — it's handled by the script itself -->
