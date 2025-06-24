<script>
	import { onMount } from 'svelte';

	const spotId = '396fdd7913db41adb7ccb8ded33c351b';

	onMount(() => {
		const existingScript = document.querySelector(`script[data-ts-spot="${spotId}"]`);
		if (existingScript) return; // Avoid duplicate loads

		const script = document.createElement('script');
		script.src = '//cdn.tsyndicate.com/sdk/v1/p.js';
		script.async = true;
		script.defer = true;
		script.setAttribute('data-ts-spot', spotId);

		document.body.appendChild(script);
	});
</script>

<!-- Optional div for layout spacing or styling -->
<div class="ts-ad w-full my-4"></div>
