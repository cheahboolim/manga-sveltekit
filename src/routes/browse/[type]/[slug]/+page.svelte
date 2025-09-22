<script lang="ts">
  import { seo } from '$lib/seo';
  import TrafficStarsAd from '$lib/components/TrafficStarsAd.svelte';

  export let data;

  // SEO setup
  seo.set(data.seo);

  // Pagination helpers
  $: showingStart = (data.page - 1) * 10 + 1;
  $: showingEnd = Math.min(data.page * 10, data.totalManga);
  $: hasNextPage = data.page < data.totalPages;
  $: hasPrevPage = data.page > 1;

  // Generate pagination range for better UX
  $: paginationRange = (() => {
    const range = [];
    const current = data.page;
    const total = data.totalPages;
    if (current > 3) range.push(1);
    if (current > 4) range.push('...');
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      range.push(i);
    }
    if (current < total - 3) range.push('...');
    if (current < total - 2) range.push(total);
    return range;
  })();
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <meta name="keywords" content={data.seo.keywords} />
  <link rel="canonical" href={data.seo.canonical} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data.seo.canonical} />
  <meta property="og:title" content={data.seo.ogTitle} />
  <meta property="og:description" content={data.seo.ogDescription} />
  <meta property="og:image" content={data.seo.ogImage} />
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={data.seo.canonical} />
  <meta property="twitter:title" content={data.seo.ogTitle} />
  <meta property="twitter:description" content={data.seo.ogDescription} />
  <meta property="twitter:image" content={data.seo.ogImage} />
  <meta name="robots" content="index, follow" />
  <meta name="author" content="SusManga" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  {#if hasPrevPage}
    <link rel="prev" href={`/browse/${data.type}/${data.slug}${data.page === 2 ? '' : `?page=${data.page - 1}`}`} />
  {/if}
  {#if hasNextPage}
    <link rel="next" href={`/browse/${data.type}/${data.slug}?page=${data.page + 1}`} />
  {/if}
  {@html `<script type="application/ld+json">${JSON.stringify(data.seo.structuredData)}</script>`}
</svelte:head>

<main class="container mx-auto px-4 py-8 max-w-7xl">
  <nav aria-label="Breadcrumb" class="mb-6">
    <ol class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
      <li><a href="/" class="hover:text-pink-500 transition-colors">Home</a></li>
      <li class="text-gray-400">/</li>
      <li><a href="/browse" class="hover:text-pink-500 transition-colors">Browse</a></li>
      <li class="text-gray-400">/</li>
      <li><a href={`/p/${data.type}`} class="hover:text-pink-500 transition-colors capitalize">{data.type}</a></li>
      <li class="text-gray-400">/</li>
      <li class="text-pink-500 font-medium" aria-current="page">{data.name}</li>
    </ol>
  </nav>

  <header class="mb-8">
    <h1 class="text-3xl md:text-4xl font-bold mb-4">
      <span class="text-gray-800 dark:text-gray-200 capitalize">{data.typeLabel}:</span>
      <span class="text-pink-500 ml-2">{data.name}</span>
    </h1>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
      <p class="text-gray-600 dark:text-gray-300">
        {data.totalManga} manga found • 
        Showing {showingStart}-{showingEnd} of {data.totalManga}
        {#if data.page > 1}• Page {data.page} of {data.totalPages}{/if}
      </p>
      {#if data.totalPages > 1}
        <div class="text-sm text-gray-500 dark:text-gray-400">
          Page {data.page} of {data.totalPages}
        </div>
      {/if}
    </div>
    <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
      <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        {#if data.type === 'tags'}
          Browse manga tagged with <strong>{data.name}</strong>. This collection features doujinshi and adult manga that include this specific tag or theme.
        {:else if data.type === 'artists'}
          Explore the complete works of <strong>{data.name}</strong>. Discover all manga created by this talented artist.
        {:else if data.type === 'parodies'}
          Read fan-made parody manga based on <strong>{data.name}</strong>. Find doujinshi and adult content inspired by this popular series.
        {:else if data.type === 'characters'}
          Find manga featuring <strong>{data.name}</strong>. Browse doujinshi starring this beloved character.
        {:else if data.type === 'categories'}
          Discover manga in the <strong>{data.name}</strong> category. Explore content within this specific genre.
        {:else if data.type === 'languages'}
          Read manga available in <strong>{data.name}</strong>. Browse content in your preferred language.
        {:else if data.type === 'groups'}
          Browse releases by <strong>{data.name}</strong> translation group. Quality translations and scanlations.
        {:else}
          Browse manga in the <strong>{data.name}</strong> collection.
        {/if}
      </p>
    </div>
  </header>

  {#if data.comics.length > 0}
    <section aria-label="Manga collection" class="mb-8">
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {#each data.comics as comic, index}
          <article class="group">
            <a 
              href={`/comic/${comic.slug}`} 
              class="block hover:opacity-90 transition-opacity duration-200 focus:ring-2 focus:ring-pink-500 focus:outline-none rounded-lg"
              aria-label="Read {comic.title}"
            >
              <div class="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <img
                  src={comic.featureImage}
                  alt={comic.title}
                  class="w-full h-auto aspect-[3/4] object-cover group-hover:scale-105 transition-transform duration-200"
                  loading={index < 8 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </div>
              <h2 class="mt-3 text-sm font-medium text-gray-800 dark:text-gray-200 text-center leading-tight line-clamp-2 group-hover:text-pink-500 transition-colors duration-200">
                {comic.title}
              </h2>
            </a>
          </article>
        {/each}
      </div>
    </section>
  {:else}
    <div class="text-center py-12">
      <p class="text-gray-600 dark:text-gray-300 text-lg mb-4">No manga found in this collection.</p>
      <a href={`/p/${data.type}`} class="text-pink-500 hover:text-pink-600 font-medium">
        ← Browse other {data.type}
      </a>
    </div>
  {/if}

  {#if data.totalPages > 1}
    <nav aria-label="Pagination" class="flex flex-col items-center gap-4 mt-12">
      <div class="flex justify-center gap-2 sm:hidden">
        {#if hasPrevPage}
          <a
            href={`/browse/${data.type}/${data.slug}${data.page === 2 ? '' : `?page=${data.page - 1}`}`}
            class="px-4 py-2 text-white rounded-lg hover:bg-pink-600 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none"
            style="background-color: #ff1493"
            aria-label="Go to previous page"
          >
            ← Prev
          </a>
        {/if}
        <span class="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg">
          {data.page} / {data.totalPages}
        </span>
        {#if hasNextPage}
          <a
            href={`/browse/${data.type}/${data.slug}?page=${data.page + 1}`}
            class="px-4 py-2 text-white rounded-lg hover:bg-pink-600 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none"
            style="background-color: #ff1493"
            aria-label="Go to next page"
          >
            Next →
          </a>
        {/if}
      </div>
      <div class="hidden sm:flex items-center gap-2">
        {#if hasPrevPage}
          <a
            href={`/browse/${data.type}/${data.slug}${data.page === 2 ? '' : `?page=${data.page - 1}`}`}
            class="px-4 py-2 text-white rounded-lg hover:bg-pink-600 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none"
            style="background-color: #ff1493"
            aria-label="Go to previous page"
          >
            ← Previous
          </a>
        {/if}
        {#each paginationRange as pageNum}
          {#if pageNum === '...'}
            <span class="px-2 py-2 text-gray-400">...</span>
          {:else if pageNum === data.page}
            <span 
              class="px-4 py-2 text-white rounded-lg font-semibold"
              style="background-color: #ff1493"
              aria-current="page"
            >
              {pageNum}
            </span>
          {:else}
            <a
              href={`/browse/${data.type}/${data.slug}${pageNum === 1 ? '' : `?page=${pageNum}`}`}
              class="px-4 py-2 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none"
              aria-label="Go to page {pageNum}"
            >
              {pageNum}
            </a>
          {/if}
        {/each}
        {#if hasNextPage}
          <a
            href={`/browse/${data.type}/${data.slug}?page=${data.page + 1}`}
            class="px-4 py-2 text-white rounded-lg hover:bg-pink-600 transition-colors focus:ring-2 focus:ring-pink-500 focus:outline-none"
            style="background-color: #ff1493"
            aria-label="Go to next page"
          >
            Next →
          </a>
        {/if}
      </div>
    </nav>
  {/if}

  <div class="mt-12 space-y-8">
  </div>
</main>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  a:focus-visible {
    outline: 2px solid #ec4899;
    outline-offset: 2px;
  }
</style>