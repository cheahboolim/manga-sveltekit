<script lang="ts">
	export let comics: {
		id: string
		title: string
		slug: string
		featureImage: string
	}[] = []

	export let page: number
	export let totalPages: number

	import MangaCard from './MangaCard.svelte'
	import { goto } from '$app/navigation'

	function goToPage(p: number) {
		if (p >= 1 && p <= totalPages) {
			goto(`/?page=${p}`)
		}
	}
</script>

<div class="py-10 px-4">
	<h2 class="text-2xl font-bold mb-6 text-center">Popular Right Now</h2>

	{#if comics.length === 0}
		<p class="text-center text-gray-500">No comics found.</p>
	{:else}
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
			{#each comics as comic}
				<MangaCard
					title={comic.title}
					coverUrl={comic.featureImage}
					href={`/comic/${comic.slug}/read`}
				/>
			{/each}
		</div>

		<div class="flex justify-center items-center gap-4 mt-8">
			<button
				class="px-4 py-2 rounded bg-pink-600 text-white disabled:opacity-50"
				disabled={page === 1}
				on:click={() => goToPage(page - 1)}
			>
				Previous
			</button>
			<button
				class="px-4 py-2 rounded bg-pink-600 text-white disabled:opacity-50"
				disabled={page >= totalPages}
				on:click={() => goToPage(page + 1)}
			>
				Next
			</button>
		</div>
	{/if}
</div>
