<script lang="ts">
	export let comics: any[] = []
	export let total: number
	export let page: number
	const PAGE_SIZE = 10

	const totalPages = Math.ceil(total / PAGE_SIZE)

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			window.location.href = `/?page=${p}`
		}
	}
</script>

<div class="py-10 px-4">
	<h2 class="text-2xl font-bold mb-6 text-center">Popular Right Now</h2>

	{#if comics.length === 0}
		<p class="text-center">No comics found.</p>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{#each comics as comic}
				<div class="bg-white rounded shadow p-4">
					<img src={comic.featureImage} alt={comic.title} class="w-full h-auto mb-2 rounded" />
					<h3 class="font-semibold text-lg truncate">{comic.title}</h3>
				</div>
			{/each}
		</div>

		<div class="flex justify-center items-center gap-4 mt-8">
			<button
				on:click={() => goToPage(page - 1)}
				class="bg-pink-500 text-white px-4 py-2 rounded disabled:opacity-50"
				disabled={page === 1}
			>
				Previous
			</button>
			<button
				on:click={() => goToPage(page + 1)}
				class="bg-pink-500 text-white px-4 py-2 rounded disabled:opacity-50"
				disabled={page >= totalPages}
			>
				Next
			</button>
		</div>
	{/if}
</div>
