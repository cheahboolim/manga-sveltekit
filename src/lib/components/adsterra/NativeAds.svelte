<script lang="ts">
	import { onMount } from 'svelte';

	let adLoaded = false;

	onMount(() => {
		const script = document.createElement('script');
		script.async = true;
		script.setAttribute('data-cfasync', 'false');
		script.src = '//pl27140626.profitableratecpm.com/4d384a18a90c03caafefee4035fcf1ea/invoke.js';
		script.onload = () => {
			adLoaded = true;
		};
		document.body.appendChild(script);
	});
</script>

<style>
	#ad-container:empty {
		display: none;
	}
</style>

<!-- Ad wrapper -->
<section class="w-full my-6 flex flex-col items-center px-4">
	<h2 class="text-sm uppercase text-gray-400 font-semibold mb-2 tracking-wide">
		Sponsored Content
	</h2>

	{#if adLoaded}
		<div id="container-4d384a18a90c03caafefee4035fcf1ea" class="w-full max-w-5xl" />
	{:else}
		<!-- Skeleton Grid: 1x4 desktop, 4x1 mobile -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl">
			{#each Array(4) as _}
				<div class="h-32 bg-gray-800 rounded animate-pulse" />
			{/each}
		</div>
	{/if}
</section>
