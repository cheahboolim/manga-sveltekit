<script lang="ts">
	export let comics: any[] = [];

	// Limit to 8 comics for the widget
	$: displayComics = comics.slice(0, 8);

	function navigateToComic(slug: string) {
		window.location.href = `/comic/${slug}`;
	}
</script>

{#if displayComics.length > 0}
	<div class="bg-black dark:bg-grey-800 rounded-lg shadow-lg p-6 mb-8">
		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold text-gray-900 dark:text-white">
				🔥 Hot now on Susmanga.com
			</h3>
		</div>
		
		<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
			{#each displayComics as comic}
				<div 
					class="group block bg-gray-50 dark:bg-black rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 hover:scale-105 cursor-pointer"
					on:click={() => navigateToComic(comic.slug)}
					on:keydown={(e) => e.key === 'Enter' && navigateToComic(comic.slug)}
					tabindex="0"
					role="button"
				>
					<div class="aspect-[3/4] relative">
						{#if comic.featureImage}
							<img
								src={comic.featureImage}
								alt={comic.title}
								class="w-full h-full object-cover"
								loading="lazy"
							/>
						{:else}
							<div class="w-full h-full bg-gray-200 dark:bg-black flex items-center justify-center">
								<span class="text-black-400 text-xs">No Image</span>
							</div>
						{/if}
						
						<!-- Overlay on hover -->
						<div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200"></div>
					</div>
					
					<div class="p-2">
						<h4 class="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
							{comic.title}
						</h4>
					</div>
				</div>
			{/each}
		</div>
		
		<div class="text-center">
			<a 
				href="/random"
				class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
			>
				<span class="mr-2">🔥</span>
				Read What's Hot Now
				<span class="ml-2">→</span>
			</a>
		</div>
	</div>
{/if}

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>