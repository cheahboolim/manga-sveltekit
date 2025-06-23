<script lang="ts">
	import ComicGrid from './ComicGrid.svelte';

	export let comics: any[] = [];
	export let total: number;
	export let page: number;
	export let seed: number;

	const PAGE_SIZE = 20;
	const totalPages = Math.ceil(total / PAGE_SIZE);

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			window.location.href = `/random?page=${p}&seed=${seed}`;
		}
	}

	function loadMoreRandom() {
		goToPage(page + 1);
	}

	function refreshRandom() {
		window.location.href = '/random?refresh=true';
	}
</script>

<div class="py-10 px-4 bg-background text-foreground min-h-screen">
	<div class="text-center mb-6">
		<h2 class="text-2xl font-bold mb-2">Random Comics</h2>
		<p class="text-foreground/70 text-sm">Discover something new every time!</p>
	</div>

	{#if comics.length === 0}
		<p class="text-center text-foreground/70">No comics found.</p>
	{:else}
		<ComicGrid {comics} />

		<div class="flex justify-center items-center gap-4 mt-8 flex-wrap">
			<!-- Refresh Random Button -->
			<button
				on:click={refreshRandom}
				class="px-4 py-2 bg-blue-600 text-white rounded border hover:bg-blue-700 transition-colors font-semibold"
			>
				🎲 New Random Set
			</button>

			<!-- Previous Button -->
			<button
				on:click={() => goToPage(page - 1)}
				class="px-4 py-2 bg-white text-black rounded border hover:bg-gray-200 disabled:opacity-50 font-semibold transition-colors"
				disabled={page === 1}
			>
				← Previous
			</button>

			<!-- Load More Button -->
			<button
				on:click={loadMoreRandom}
				class="px-4 py-2 bg-pink-600 text-white rounded border hover:bg-pink-700 disabled:opacity-50 font-semibold transition-colors"
				disabled={page >= totalPages}
			>
				LOAD MORE RANDOM
			</button>
		</div>
	{/if}
</div>