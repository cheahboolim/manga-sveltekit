<!-- src/routes/404/+page.svelte -->
<script lang="ts">
	import AAdsBanner from '$lib/components/AAdsBanner.svelte'
	import AAdsMiddleBanner from '$lib/components/AAdsMiddleBanner.svelte'
	import NativeAds from '$lib/components/adsterra/NativeAds.svelte'
	import { goto } from '$app/navigation'

	export let data

	// Comic grid component inline since we need it styled consistently
	function navigateToComic(slug: string) {
		goto(`/comic/${slug}`)
	}
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta name="description" content={data.meta.description} />
	<meta name="robots" content="noindex, follow" />

	<!-- Open Graph tags -->
	<meta property="og:title" content={data.meta.title} />
	<meta property="og:description" content={data.meta.description} />
	<meta property="og:type" content="website" />
	<meta
		property="og:image"
		content="{import.meta.env.PUBLIC_CDN_BASE_URL}/main/Read Hentai-home.jpg"
	/>
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/jpeg" />
	<meta property="og:site_name" content="Read Hentai" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta
		name="twitter:image"
		content="{import.meta.env.PUBLIC_CDN_BASE_URL}/main/Read Hentai-home.jpg"
	/>
	<meta name="twitter:title" content={data.meta.title} />
	<meta name="twitter:description" content={data.meta.description} />
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
	<!-- 404 Message Section -->
	<div class="text-center py-16">
		<!-- Large 404 -->
		<h1 class="text-8xl md:text-9xl font-bold text-[#FF1493] mb-4">404</h1>

		<!-- Main message -->
		<h2 class="text-3xl md:text-4xl font-bold text-white mb-6">Manga Not Found</h2>

		<!-- Explanation -->
		<div class="max-w-2xl mx-auto space-y-4 text-gray-300 text-lg mb-8">
			<p>Sorry! The manga you were looking for has been removed or is no longer available.</p>
			<p>This could be due to copyright issues, content policy changes, or other reasons.</p>
		</div>

		<!-- Action buttons -->
		<div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
			<a href="/" class="inline-block">
				<button
					class="bg-[#FF1493] hover:bg-[#e01382] text-white font-bold px-8 py-3 rounded-xl shadow-lg transition"
				>
					Browse Popular Manga
				</button>
			</a>

			<a href="/search" class="inline-block">
				<button
					class="bg-gray-600 hover:bg-gray-500 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition"
				>
					Search Other Manga
				</button>
			</a>
		</div>
	</div>

	<!-- Ad Banner -->
	<div class="mb-12">
		<AAdsMiddleBanner />
	</div>

	<!-- Recommended Manga Section -->
	{#if data.recommendedComics && data.recommendedComics.length > 0}
		<section class="mb-12">
			<div class="text-center mb-8">
				<h2 class="text-3xl font-bold text-white mb-4">You Might Also Like</h2>
				<p class="text-gray-300 text-lg">Discover other popular manga and doujinshi</p>
			</div>

			<!-- Manga Grid -->
			<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
				{#each data.recommendedComics as comic}
					<div
						class="group cursor-pointer"
						on:click={() => navigateToComic(comic.slug)}
						on:keydown={(e) => e.key === 'Enter' && navigateToComic(comic.slug)}
						role="button"
						tabindex="0"
					>
						<div
							class="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform group-hover:scale-105"
						>
							{#if comic.featureImage}
								<img
									src={comic.featureImage}
									alt={comic.title}
									class="w-full h-48 sm:h-56 md:h-64 object-cover group-hover:opacity-90 transition-opacity"
									loading="lazy"
									on:error={(e) => {
										e.currentTarget.src = '/placeholder-manga.jpg'
									}}
								/>
							{:else}
								<div
									class="w-full h-48 sm:h-56 md:h-64 bg-gray-700 flex items-center justify-center"
								>
									<span class="text-gray-400 text-sm">No Image</span>
								</div>
							{/if}

							<!-- Overlay on hover -->
							<div
								class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"
							></div>

							<!-- Title overlay -->
							<div
								class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3"
							>
								<h3 class="text-white text-sm font-medium line-clamp-2 leading-tight">
									{comic.title}
								</h3>
							</div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Load more button -->
			<div class="text-center mt-8">
				<a href="/" class="inline-block">
					<button
						class="bg-transparent border-2 border-[#FF1493] text-[#FF1493] hover:bg-[#FF1493] hover:text-white font-bold px-8 py-3 rounded-xl transition"
					>
						View More Manga
					</button>
				</a>
			</div>
		</section>
	{/if}

	<!-- Bottom Ad -->
	<div class="mt-12">
		<AAdsBanner />
	</div>

	<!-- Native Ads -->
	<div class="mt-8">
		<NativeAds />
	</div>
</main>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
