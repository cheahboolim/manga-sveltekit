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
	let isNavigating = false;
	let showInstructions = true;
	let isScrolling = false;
	let scrollTimeout: ReturnType<typeof setTimeout>;

	onMount(() => {
		if (scrollTarget) {
			scrollTarget.scrollIntoView({ behavior: 'smooth' });
		}

		// Hide instructions after 5 seconds
		setTimeout(() => {
			showInstructions = false;
		}, 5000);

		// Listen for scroll events to prevent accidental navigation
		const handleScroll = () => {
			isScrolling = true;
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(() => {
				isScrolling = false;
			}, 150);
		};

		// Listen for keyboard arrow keys
		const handleKeyDown = (event: KeyboardEvent) => {
			if (isNavigating || isScrolling) return;
			
			if (event.key === 'ArrowLeft') {
				event.preventDefault();
				if (currentPage > 0) {
					goToPage(currentPage - 1);
				}
			} else if (event.key === 'ArrowRight') {
				event.preventDefault();
				if ((currentPage + 1) * pageCount < totalPages) {
					goToPage(currentPage + 1);
				}
			}
		};

		window.addEventListener('scroll', handleScroll);
		window.addEventListener('keydown', handleKeyDown);
		
		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('keydown', handleKeyDown);
			clearTimeout(scrollTimeout);
		};
	});

	function goToPage(pageIndex: number) {
		isNavigating = true;
		const url = `/comic/${slug}/read?page=${pageIndex}`;
		goto(url);
	}

	function handleImageTap(event: MouseEvent | TouchEvent | KeyboardEvent) {
		// Handle keyboard events
		if (event instanceof KeyboardEvent) {
			if (event.key !== 'Enter' && event.key !== ' ') return;
			event.preventDefault();
		}

		// Don't navigate if user is scrolling
		if (isScrolling || isNavigating) return;

		const target = event.currentTarget as HTMLElement;
		const rect = target.getBoundingClientRect();
		
		let clickX: number;
		
		// For keyboard events, treat as middle click
		if (event instanceof KeyboardEvent) {
			clickX = rect.width * 0.5;
		} else if (event instanceof TouchEvent) {
			// Handle touch events for mobile
			const touch = event.touches[0] || event.changedTouches[0];
			clickX = touch.clientX - rect.left;
		} else {
			// Handle mouse events
			clickX = event.clientX - rect.left;
		}
		
		const imageWidth = rect.width;
		
		// Left half for previous, right half for next
		if (clickX < imageWidth * 0.5) {
			// Left side - go to previous page
			if (currentPage > 0) {
				goToPage(currentPage - 1);
			}
		} else {
			// Right side - go to next page
			if ((currentPage + 1) * pageCount < totalPages) {
				goToPage(currentPage + 1);
			}
		}
	}
</script>

<div class="space-y-4">
	<div bind:this={scrollTarget}></div>

	<h1 class="text-2xl font-bold">{title}</h1>

	<!-- Instructions -->
	{#if showInstructions}
		<div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-lg z-50 text-sm border">
			<div class="flex items-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Tap left side of image for previous, right side for next</span>
				<button 
					on:click={() => showInstructions = false}
					class="ml-2 text-gray-500 hover:text-gray-700"
				>
					×
				</button>
			</div>
		</div>
	{/if}

	<!-- Loading indicator -->
	{#if isNavigating}
		<div class="fixed top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-lg shadow-lg z-50">
			Loading...
		</div>
	{/if}

	<div class="space-y-2">
		{#each images as img, index}
			<div class="relative group">
				<!-- Interactive wrapper for tap functionality -->
				<button
					type="button"
					class="w-full block p-0 border-0 bg-transparent cursor-pointer"
					on:click={handleImageTap}
					on:touchend={handleImageTap}
					on:keydown={handleImageTap}
				>
					<img
						src={img}
						alt={`Page ${currentPage * pageCount + index + 1}`}
						class="w-full rounded-lg shadow select-none"
						draggable="false"
					/>
				</button>
				
				<!-- Visual hint areas (only visible on hover) -->
				<div class="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<!-- Left tap area -->
					{#if currentPage > 0}
						<div class="absolute left-0 top-0 w-1/2 h-full bg-black bg-opacity-10 flex items-center justify-start pl-4">
							<div class="bg-black bg-opacity-50 text-white p-2 rounded-full">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
								</svg>
							</div>
						</div>
					{/if}
					
					<!-- Right tap area -->
					{#if (currentPage + 1) * pageCount < totalPages}
						<div class="absolute right-0 top-0 w-1/2 h-full bg-black bg-opacity-10 flex items-center justify-end pr-4">
							<div class="bg-black bg-opacity-50 text-white p-2 rounded-full">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
								</svg>
							</div>
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</div>

	<!-- Navigation description after the 3rd image -->
	{#if images.length >= 3}
		<div class="text-center text-gray-600 text-sm mt-4 p-3 bg-gray-50 rounded-lg">
			<div class="flex items-center justify-center gap-2">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
				</svg>
				<span>Tap or use arrow keys to navigate. Right: next page, Left: previous page</span>
			</div>
		</div>
	{/if}

	<div class="flex justify-between mt-4">
		{#if currentPage > 0}
			<Button 
				on:click={() => goToPage(currentPage - 1)} 
				className="mr-2"
				disabled={isNavigating}
			>
				{isNavigating ? 'Loading...' : 'Previous'}
			</Button>
		{/if}

		{#if (currentPage + 1) * pageCount < totalPages}
			<Button 
				on:click={() => goToPage(currentPage + 1)}
				disabled={isNavigating}
			>
				{isNavigating ? 'Loading...' : 'Next'}
			</Button>
		{/if}
	</div>
</div>