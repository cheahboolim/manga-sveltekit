<script lang="ts">
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { seo } from '$lib/seo';
  import SimilarManga from '$lib/components/SimilarManga.svelte';
  import RandomPost from '$lib/components/RandomPost.svelte';
  import TrafficStarsAd from '$lib/components/TrafficStarsAd.svelte';

  export let data: {
    slug: string;
    manga: { id: string; title: string; tagIds: number[]; tagNames: string[] };
    images: string[];
    currentPage: number;
    totalPages: number;
    randomComics: any[];
    seo: {
      title: string;
      description: string;
      canonical: string;
      prev?: string;
      next?: string;
      keywords: string;
      ogImage: string;
      jsonLd: any;
    };
  };

  const { slug, manga, totalPages } = data;
  const IMAGES_PER_PAGE = data.images.length;

  // Track URL param for dynamic navigation
  let currentPage = data.currentPage;
  $: {
    const urlPage = Number($page.url.searchParams.get('page'));
    if (!isNaN(urlPage) && urlPage !== currentPage) {
      currentPage = urlPage;
    }
  }

  // Use server-generated SEO data directly - no duplication!
  onMount(() => {
    // Set the SEO metadata from server-side data
    seo.set({
      title: data.seo.title,
      description: data.seo.description,
      canonical: data.seo.canonical,
      ...(data.seo.prev && { prev: data.seo.prev }),
      ...(data.seo.next && { next: data.seo.next })
    });
  });

  function goToPage(n: number) {
    if (n >= 1 && n <= totalPages) {
      goto(`/comic/${slug}/read?page=${n}`, {
        replaceState: false,
        keepFocus: true,
        invalidateAll: true
      });
    }
  }

  // Dynamic page title for browser tab (avoiding reactive property issues)
  let pageTitle: string;
  $: pageTitle = currentPage === 1
    ? `Read ${manga.title} Online Free - Chapter ${currentPage} | SusManga`
    : `${manga.title} - Page ${currentPage} Online Reader | SusManga`;
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="description" content={data.seo.description} />
  <meta name="keywords" content={data.seo.keywords} />
  <link rel="canonical" href={data.seo.canonical} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data.seo.canonical} />
  <meta property="og:title" content={data.seo.title} />
  <meta property="og:description" content={data.seo.description} />
  <meta property="og:image" content={data.seo.ogImage} />
  <meta property="og:site_name" content="SusManga" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content={data.seo.canonical} />
  <meta name="twitter:title" content={data.seo.title} />
  <meta name="twitter:description" content={data.seo.description} />
  <meta name="twitter:image" content={data.seo.ogImage} />
  
  <!-- Pagination -->
  {#if data.seo.prev}
    <link rel="prev" href={data.seo.prev} />
  {/if}
  {#if data.seo.next}
    <link rel="next" href={data.seo.next} />
  {/if}
  
  <!-- Structured Data -->
  <script type="application/ld+json">
    {JSON.stringify(data.seo.jsonLd)}
  </script>
</svelte:head>

<main class="container mx-auto px-4 py-8">
  <!-- Breadcrumb for SEO -->
  <nav class="mb-6" aria-label="Breadcrumb">
    <ol class="flex items-center space-x-2 text-sm text-gray-300">
      <li><a href="/" class="hover:text-white">Home</a></li>
      <li class="text-gray-500">›</li>
      <li><a href={`/comic/${slug}`} class="hover:text-white">Gallery</a></li>
      <li class="text-gray-500">›</li>
      <li class="text-white font-medium">Read Online</li>
    </ol>
  </nav>

  <!-- Top navigation -->
  <div class="mb-6 flex flex-wrap gap-4 items-center justify-between">
    <a
      href={`/comic/${slug}`}
      class="px-4 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
    >
      ← Back to Gallery
    </a>
    
    <!-- Page indicator -->
    <div class="text-gray-300 text-sm">
      Page {currentPage} of {totalPages}
    </div>
  </div>

  <!-- Enhanced title with more context -->
  <header class="mb-6 text-center">
    <h1 class="text-3xl md:text-4xl font-bold mb-2 text-white">
      {manga.title}
    </h1>
    <p class="text-gray-400 text-sm">
      Reading Page {currentPage} 
      {#if manga.tagNames.length > 0}
        • {manga.tagNames.slice(0, 3).join(', ')}
      {/if}
    </p>
  </header>

  <!-- Enhanced images with better SEO -->
  <section class="space-y-4 mb-8" aria-label="Manga pages">
    {#each data.images as url, idx}
      <div class="relative">
        <img
          src={url}
          alt={`${manga.title} - Page ${(currentPage - 1) * IMAGES_PER_PAGE + idx + 1}`}
          class="w-full rounded-lg shadow-lg"
          loading="lazy"
          decoding="async"
        />
        <div class="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          Page {(currentPage - 1) * IMAGES_PER_PAGE + idx + 1}
        </div>
      </div>
    {/each}
  </section>

  <!-- Enhanced pagination with better UX -->
  <nav class="flex justify-center items-center flex-wrap gap-2 mb-8" aria-label="Pagination">
    {#if currentPage > 1}
      <button
        class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
        on:click={() => goToPage(currentPage - 1)}
        aria-label="Previous page"
      >
        ← Previous
      </button>
    {/if}

    <!-- Smart pagination - show first, last, and surrounding pages -->
    {#each Array(totalPages) as _, i}
      {#if i + 1 === 1 || i + 1 === totalPages || Math.abs(i + 1 - currentPage) <= 2}
        <button
          class={
            i + 1 === currentPage
              ? 'px-3 py-2 rounded bg-pink-600 text-white font-bold'
              : 'px-3 py-2 rounded border bg-white text-black hover:bg-gray-100 transition-colors'
          }
          on:click={() => goToPage(i + 1)}
          aria-label={`Go to page ${i + 1}`}
          aria-current={i + 1 === currentPage ? 'page' : undefined}
        >
          {i + 1}
        </button>
      {:else if i + 1 === currentPage - 3 || i + 1 === currentPage + 3}
        <span class="px-2 text-gray-500">...</span>
      {/if}
    {/each}

    {#if currentPage < totalPages}
      <button
        class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
        on:click={() => goToPage(currentPage + 1)}
        aria-label="Next page"
      >
        Next →
      </button>
    {/if}
  </nav>

  <!-- Bottom navigation with better hierarchy -->
  <nav class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 mb-8">
    <a
      href={`/comic/${slug}`}
      class="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
    >
      📖 Back to Gallery
    </a>
    <a
      href="/"
      class="px-6 py-2 bg-pink-600 text-white rounded hover:bg-pink-700 transition-colors"
    >
      🏠 Back to SUSMANGA.COM
    </a>
  </nav>

  <!-- Content sections with better spacing -->
  <div class="space-y-8">
    <!-- Similar Manga Widget -->
    <section aria-label="Similar manga recommendations">
      <SimilarManga 
        tagIds={manga.tagIds} 
        currentMangaId={manga.id} 
      />
    </section>
    
    <!-- Ad section -->
    <section aria-label="Advertisement">
      <TrafficStarsAd />
    </section>
    
    <!-- Hot Now Widget -->
    <section aria-label="Popular manga">
      <RandomPost comics={data.randomComics} />
    </section>
  </div>
</main>

<style>
  /* Enhanced visual hierarchy */
  main {
    background: linear-gradient(135deg, #1a1a2e 0%, #1a1a2e 100%);
    min-height: 100vh;
  }
  
  /* Smooth transitions for better UX */
  * {
    transition: all 0.2s ease;
  }
</style>