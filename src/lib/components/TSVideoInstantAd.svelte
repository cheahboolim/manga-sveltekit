<script>
	import { onMount } from 'svelte';

	let adLoaded = false;

	onMount(() => {
		if (adLoaded) return;

		// Optional: skip on small screens
		// if (window.innerWidth < 480) return;

		const script = document.createElement('script');
		script.src = '//cdn.tsyndicate.com/sdk/v1/video.instant.message.js';
		script.async = true;

		script.onload = () => {
			if (window.TSVideoInstantMessage) {
				window.TSVideoInstantMessage({
					spot: '8ca537e975ab403baa7e50216824ac83',
					extid: '', // optional — replace with dynamic ID if needed
					width: '10%', // applies on desktop
					mobileWidth: '25%',
					displayMode: 'capped',
					cappedAction: 'click',
					cappedValueInMinutes: 10,
					showCTAButton: true,
					hideOnComplete: false
				});
				adLoaded = true;
			}
		};

		document.body.appendChild(script);
	});
</script>

<!-- Optional container if you want to position or style the ad trigger -->
<div class="fixed bottom-4 right-4 z-50">
	<!-- The ad will display via script after onMount -->
</div>
