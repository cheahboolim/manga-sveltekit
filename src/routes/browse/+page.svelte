<script lang="ts">
    import AAdsBanner from '$lib/components/AAdsBanner.svelte'
    import AAdsMiddleBanner from '$lib/components/AAdsMiddleBanner.svelte'
    import { goto } from '$app/navigation'
    
    export let data

    function navigateToComic(slug: string) {
        goto(`/comic/${slug}`)
    }
</script>

<svelte:head>
    <title>{data.meta.title}</title>
    <meta name="description" content={data.meta.description} />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href={data.meta.canonical} />

    <!-- Open Graph tags -->
    <meta property="og:title" content={data.meta.title} />
    <meta property="og:description" content={data.meta.description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content={data.meta.ogImage} />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:url" content={data.meta.canonical} />
    <meta property="og:site_name" content="Read Hentai" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content={data.meta.ogImage} />
    <meta name="twitter:title" content={data.meta.title} />
    <meta name="twitter:description" content={data.meta.description} />

    <!-- Structured Data -->
    <script type="application/ld+json">{JSON.stringify(data.meta.jsonLd)}</script>
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
    <!-- Browse Categories Section -->
    <div class="text-center py-16">
        <h1 class="text-6xl md:text-7xl font-bold text-[#FF1493] mb-4">Browse</h1>
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">Discover Manga by Category</h2>
        <div class="max-w-2xl mx-auto space-y-4 text-gray-300 text-lg mb-12">
            <p>Explore our vast collection of manga, hentai, and doujinshi organized by your favorite categories.</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
            <a href="/p/tags" class="group">
                <div class="bg-gradient-to-br from-pink-600 to-pink-800 hover:from-pink-500 hover:to-pink-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">🏷️</div>
                    <h3 class="text-xl font-bold text-white mb-2">Tags</h3>
                    <p class="text-pink-100 text-sm">Browse by content tags</p>
                </div>
            </a>
            <a href="/p/artists" class="group">
                <div class="bg-gradient-to-br from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">👨‍🎨</div>
                    <h3 class="text-xl font-bold text-white mb-2">Artists</h3>
                    <p class="text-purple-100 text-sm">Find works by artist</p>
                </div>
            </a>
            <a href="/p/parodies" class="group">
                <div class="bg-gradient-to-br from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">🎭</div>
                    <h3 class="text-xl font-bold text-white mb-2">Parodies</h3>
                    <p class="text-blue-100 text-sm">Anime & game parodies</p>
                </div>
            </a>
            <a href="/p/characters" class="group">
                <div class="bg-gradient-to-br from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">👥</div>
                    <h3 class="text-xl font-bold text-white mb-2">Characters</h3>
                    <p class="text-green-100 text-sm">Browse by characters</p>
                </div>
            </a>
            <a href="/p/groups" class="group">
                <div class="bg-gradient-to-br from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">👥</div>
                    <h3 class="text-xl font-bold text-white mb-2">Groups</h3>
                    <p class="text-red-100 text-sm">Find works by groups</p>
                </div>
            </a>
            <a href="/p/categories" class="group">
                <div class="bg-gradient-to-br from-yellow-600 to-orange-700 hover:from-yellow-500 hover:to-orange-600 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">📂</div>
                    <h3 class="text-xl font-bold text-white mb-2">Categories</h3>
                    <p class="text-yellow-100 text-sm">Browse by categories</p>
                </div>
            </a>
            <a href="/p/languages" class="group">
                <div class="bg-gradient-to-br from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">🌐</div>
                    <h3 class="text-xl font-bold text-white mb-2">Languages</h3>
                    <p class="text-indigo-100 text-sm">Browse by language</p>
                </div>
            </a>
            <a href="/" class="group">
                <div class="bg-gradient-to-br from-gray-600 to-gray-800 hover:from-gray-500 hover:to-gray-700 rounded-xl p-6 shadow-lg transition-all duration-300 transform group-hover:scale-105">
                    <div class="text-4xl mb-3">🎲</div>
                    <h3 class="text-xl font-bold text-white mb-2">Random</h3>
                    <p class="text-gray-100 text-sm">Discover something new</p>
                </div>
            </a>
        </div>
    </div>

    <div class="mb-12">
        <AAdsMiddleBanner />
    </div>

    {#if data.popularComics && data.popularComics.length > 0}
        <section class="mb-12">
            <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-white mb-4">Popular Right Now</h2>
                <p class="text-gray-300 text-lg">Trending manga and doujinshi from our community</p>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {#each data.popularComics as comic}
                    <div class="group cursor-pointer" on:click={() => navigateToComic(comic.slug)} on:keydown={(e) => e.key === 'Enter' && navigateToComic(comic.slug)} role="button" tabindex="0">
                        <div class="relative overflow-hidden rounded-lg bg-gray-800 shadow-lg transition-transform group-hover:scale-105">
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
                                <div class="w-full h-48 sm:h-56 md:h-64 bg-gray-700 flex items-center justify-center">
                                    <span class="text-gray-400 text-sm">No Image</span>
                                </div>
                            {/if}
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300"></div>
                            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3">
                                <h3 class="text-white text-sm font-medium line-clamp-2 leading-tight">
                                    {comic.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
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

    <div class="mt-12">
        <AAdsBanner />
    </div>
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