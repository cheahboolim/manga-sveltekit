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
    manga: { id: string; title: string; tagIds: number[] };
    images: string[];
    currentPage: number;
    totalPages: number;
    randomComics: any[];
  };

  const { slug, manga, totalPages } = data;
  const IMAGES_PER_PAGE = data.images.length;

  // Track URL param
  let currentPage = data.currentPage;
  $: {
    const urlPage = Number($page.url.searchParams.get('page'));
    if (!isNaN(urlPage) && urlPage !== currentPage) {
      currentPage = urlPage;
    }
  }

  // SEO Metadata
  const title =
    currentPage === 1
      ? `${manga.title} - Read Online Free | SusManga`
      : `${manga.title} - Page ${currentPage} | Read Online Free | SusManga`;

  const description = `Read ${manga.title} online${
    currentPage > 1 ? ` - page ${currentPage}` : ''
  }. SusManga lets you enjoy high quality translated manga.`

  const canonical = `https://susmanga.com/comic/${slug}/read${
    currentPage > 1 ? `?page=${currentPage}` : ''
  }`;

  const prev =
    currentPage > 1
      ? `/comic/${slug}/read${currentPage - 1 === 1 ? '' : `?page=${currentPage - 1}`}`
      : undefined;

  const next =
    currentPage < totalPages
      ? `/comic/${slug}/read?page=${currentPage + 1}`
      : undefined;

  // Set metadata
  seo.set({
    title,
    description,
    canonical,
    prev,
    next
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
</script>

<main class="container mx-auto px-4 py-8">
  <!-- Top back button -->
  <div class="mb-6">
    <a
      href={`/comic/${slug}`}
      class="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
    >
      ← Back to Gallery
    </a>
  </div>

  <!-- Title -->
  <h1 class="text-3xl font-bold mb-6 text-center text-white">
    {manga.title}
  </h1>

  <!-- Pages -->
  <div class="space-y-4 mb-8">
    {#each data.images as url, idx}
      <img
        src={url}
        alt={`Page ${(currentPage - 1) * IMAGES_PER_PAGE + idx + 1}`}
        class="w-full rounded-lg shadow"
        loading="lazy"
      />
    {/each}
  </div>

  <!-- Pagination -->
  <div class="flex justify-center items-center flex-wrap gap-2 mb-4">
    {#if currentPage > 1}
      <button
        class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        on:click={() => goToPage(currentPage - 1)}
      >
        Previous
      </button>
    {/if}

    {#each Array(totalPages) as _, i}
      <button
        class={
          i + 1 === currentPage
            ? 'px-3 py-1 rounded border bg-pink-600 text-white font-bold'
            : 'px-3 py-1 rounded border bg-white text-black hover:bg-gray-100'
        }
        on:click={() => goToPage(i + 1)}
      >
        {i + 1}
      </button>
    {/each}

    {#if currentPage < totalPages}
      <button
        class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
        on:click={() => goToPage(currentPage + 1)}
      >
        Next
      </button>
    {/if}
  </div>

  <!-- Bottom navigation links -->
  <div class="flex flex-col items-center space-y-4 mt-10">
    <a
      href={`/comic/${slug}`}
      class="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
    >
      Back to Gallery
    </a>
    <a
      href="/"
      class="px-4 py-2 bg-pink-600 text-white rounded hover:bg-pink-700"
    >
      Back to SUSMANGA.COM
    </a>
  </div>

  <!-- Similar Manga Widget -->
  <SimilarManga 
    tagIds={manga.tagIds} 
    currentMangaId={manga.id} 
  />
  <TrafficStarsAd />
    <!-- Hot Now Widget -->
  <RandomPost comics={data.randomComics} />
</main>