<script lang="ts">
	import ComicGrid from './ComicGrid.svelte';

	export let comics: any[] = [];
	export let total: number;
	export let page: number;

	const PAGE_SIZE = 10;
	const totalPages = Math.ceil(total / PAGE_SIZE);

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			window.location.href = `/?page=${p}`;
		}
	}
</script>

<div class="py-10 px-4 bg-background text-foreground min-h-screen">
	<h2 class="text-2xl font-bold mb-6 text-center">Popular Right Now</h2>

	{#if comics.length === 0}
		<p class="text-center text-foreground/70">No comics found.</p>
	{:else}
		<ComicGrid {comics} />

		<div class="flex justify-center items-center gap-4 mt-8">
			<!-- Previous Button -->
			<button
				on:click={() => goToPage(page - 1)}
				class="px-4 py-2 bg-white text-black rounded border hover:bg-gray-200 disabled:opacity-50 font-semibold"
				disabled={page === 1}
			>
				← Previous
			</button>

			<!-- Load More Button -->
			<button
				on:click={() => goToPage(page + 1)}
				class="px-4 py-2 bg-pink-600 text-white rounded border hover:bg-gray-200 disabled:opacity-50 font-semibold"
				disabled={page >= totalPages}
			>
				LOAD MORE MANGA
			</button>
		</div>
	{/if}
</div>
