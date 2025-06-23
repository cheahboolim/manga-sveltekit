<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		// Load the TrafficStars SDK script dynamically
		const existingScript = document.querySelector('script[src="//cdn.tsyndicate.com/sdk/v1/n.js"]');
		if (!existingScript) {
			const script = document.createElement('script');
			script.src = '//cdn.tsyndicate.com/sdk/v1/n.js';
			script.onload = () => initAd();
			document.body.appendChild(script);
		} else {
			initAd();
		}

		function initAd() {
			// @ts-ignore: NativeAd is injected globally
			if (typeof NativeAd !== 'undefined') {
				NativeAd({
					element_id: 'ts_ad_native_35n6d',
					spot: 'de4e417b900a4241b0d0136f3fae2aff',
					type: 'label-under',
					cols: 4,
					rows: 1,
					title: 'Susmanga.com Ads',
					titlePosition: 'left',
					adsByPosition: 'right',
					breakpoints: [
						{ cols: 2, width: 770 }
					],
					keywords: '', // Fill in dynamic data if needed
					subid: '',    // Fill in dynamic data if needed
					showLogoInfo: true
				});
			}
		}
	});
</script>

<!-- Container for the ad -->
<div id="ts_ad_native_35n6d" class="my-4"></div>
