<script lang="ts">
  export let data: {
    query: string;
    comics: {
      id: string;
      title: string;
      slug: string;
      featureImage: string;
      author: { name: string };
    }[];
    page: number;
    totalPages: number;
    meta: {
      title: string;
      description: string;
      prev: string | null;
      next: string | null;
    };
  };
  import ExoClickSlider from '$lib/components/exoclick/ExoClickSlider.svelte';
  import ExoOutstreamAd from '$lib/components/exoclick/ExoOutstreamAd.svelte';
  import MobilePop from '$lib/components/exoclick/MobilePop.svelte';
  import ExoBannerAd from '$lib/components/exoclick/ExoBannerAd.svelte';
  import AAdsMiddleBanner from '$lib/components/aads/AAdsMiddleBanner.svelte';
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  <link rel="canonical" href={`/search?q=${encodeURIComponent(data.query)}${data.page > 1 ? `&page=${data.page}` : ''}`} />
  <meta property="og:title" content={data.meta.title} />
  <meta property="og:description" content={data.meta.description} />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={data.meta.title} />
  <meta name="twitter:description" content={data.meta.description} />
  {#if data.meta.prev}
    <link rel="prev" href={data.meta.prev} />
  {/if}
  {#if data.meta.next}
    <link rel="next" href={data.meta.next} />
  {/if}
</svelte:head>

<main class="container mx-auto px-4 py-12">
  <!-- A-Ads Banner above content -->
  <div class="my-6">
    <AAdsMiddleBanner />
  </div>
  <h1 class="text-3xl font-bold mb-6">
    Search results for: <span class="text-pink-500">{data.query}</span>
  </h1>

  {#if data.comics.length === 0}
    <p class="text-muted-foreground">No comics found.</p>
  {:else}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each data.comics as comic}
        <a href={`/comic/${comic.slug}`} class="block hover:opacity-90">
          <img
            src={comic.featureImage}
            alt={comic.title}
            class="w-full h-auto rounded shadow"
            loading="lazy"
          />
          <p class="mt-2 text-sm font-medium text-white text-center">
            {comic.title}
          </p>
        </a>
      {/each}
    </div>

    <nav class="flex justify-center items-center flex-wrap gap-2 mb-8" aria-label="Pagination">
      {#if data.page > 1}
        <a
          href={`/search?q=${encodeURIComponent(data.query)}&page=${data.page - 1}`}
          class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          aria-label="Previous page"
        >
          ← Previous
        </a>
      {/if}
      {#each Array(data.totalPages) as _, i}
        {#if i + 1 === 1 || i + 1 === data.totalPages || Math.abs(i + 1 - data.page) <= 2}
          <a
            href={`/search?q=${encodeURIComponent(data.query)}&page=${i + 1}`}
            class={i + 1 === data.page
              ? 'px-3 py-2 rounded bg-pink-600 text-white font-bold'
              : 'px-3 py-2 rounded border bg-white text-black hover:bg-gray-100 transition-colors'}
            aria-label={`Go to page ${i + 1}`}
            aria-current={i + 1 === data.page ? 'page' : undefined}
          >
            {i + 1}
          </a>
        {:else if i + 1 === data.page - 3 || i + 1 === data.page + 3}
          <span class="px-2 text-gray-500">...</span>
        {/if}
      {/each}
      {#if data.page < data.totalPages}
        <a
          href={`/search?q=${encodeURIComponent(data.query)}&page=${data.page + 1}`}
          class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
          aria-label="Next page"
        >
          Next →
        </a>
      {/if}
    </nav>
  {/if}
  
  <!-- ExoClick Banner Ad -->
  <div class="mt-8">
    <ExoBannerAd />
  </div>
</main>

<!-- ExoClick Video Ads (full width) -->
<ExoClickSlider />
<ExoOutstreamAd />
<MobilePop />