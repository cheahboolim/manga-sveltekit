<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button.svelte';

	export let slug: string;
	export let title: string;
	// Remove if unused
	// export let tagIds: number[];
	export let images: string[];
	export let currentPage: number;
	export let pageCount: number;
	export let totalPages: number;

	let scrollTarget: HTMLDivElement;

	onMount(() => {
		if (scrollTarget) {
			scrollTarget.scrollIntoView({ behavior: 'smooth' });
		}
	});

	function goToPage(pageIndex: number) {
		const url = `/comic/${slug}/read?page=${pageIndex}`;
		goto(url, { keepFocus: true });
	}
</script>

<div class="space-y-4">
	<div bind:this={scrollTarget}></div>

	<h1 class="text-2xl font-bold">{title}</h1>

	<div class="space-y-2">
		{#each images as img, index}
			<img
				src={img}
				alt={`Page ${currentPage * pageCount + index + 1}`}
				loading="lazy"
				class="w-full rounded-lg shadow"
			/>
		{/each}
	</div>

	<div class="flex justify-between mt-4">
		{#if currentPage > 0}
			<Button on:click={() => goToPage(currentPage - 1)} className="mr-2">
				Previous
			</Button>
		{/if}

		{#if (currentPage + 1) * pageCount < totalPages}
			<Button on:click={() => goToPage(currentPage + 1)}>
				Next
			</Button>
		{/if}
	</div>
</div>
