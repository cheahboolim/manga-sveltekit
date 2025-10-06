<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import { seo } from '$lib/seo.ts';
  import { onMount } from 'svelte';
  import AAdsMiddleBanner from '$lib/components/aads/AAdsMiddleBanner.svelte';

  export let data: {
    grouped: Record<string, { id: string; name: string; slug: string }[]>;
    totalParodies: number;
    availableLetters: string[];
    seo: {
      title: string;
      description: string;
      canonical: string;
      keywords: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      structuredData: any;
    };
  };

  const searchQuery = writable('');
  const filteredGrouped = derived([searchQuery], ([$searchQuery]) => {
    const query = $searchQuery.trim().toLowerCase();
    const result: typeof data.grouped = {};

    for (const key in data.grouped) {
      const matches = data.grouped[key].filter(item =>
        item.name.toLowerCase().includes(query)
      );
      if (matches.length > 0) result[key] = matches;
    }

    return result;
  });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update URL hash without triggering page reload
      history.replaceState(null, '', `#${id}`);
    }
  };

  // Handle initial hash on page load
  onMount(() => {
    const hash = window.location.hash.slice(1);
    if (hash && data.availableLetters.includes(hash)) {
      setTimeout(() => scrollToSection(hash), 100);
    }
  });

  // SEO
  seo.set(data.seo);

  // Reactive search results count
  $: searchResultsCount = Object.values($filteredGrouped).reduce((sum, arr) => sum + arr.length, 0);
  $: isSearching = $searchQuery.trim().length > 0;
</script>

<svelte:head>
  <title>{data.seo.title}</title>
  <meta name="description" content={data.seo.description} />
  <meta name="keywords" content={data.seo.keywords} />
  <link rel="canonical" href={data.seo.canonical} />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={data.seo.canonical} />
  <meta property="og:title" content={data.seo.ogTitle} />
  <meta property="og:description" content={data.seo.ogDescription} />
  <meta property="og:image" content={data.seo.ogImage} />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={data.seo.canonical} />
  <meta property="twitter:title" content={data.seo.ogTitle} />
  <meta property="twitter:description" content={data.seo.ogDescription} />
  <meta property="twitter:image" content={data.seo.ogImage} />
  
  <!-- Additional SEO -->
  <meta name="robots" content="index, follow" />
  <meta name="author" content="Sus Manga" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Structured Data -->
  {@html `<script type="application/ld+json">${JSON.stringify(data.seo.structuredData)}</script>`}
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
  <!-- A-Ads Banner above content -->
  <div class="my-6">
    <AAdsMiddleBanner />
  </div>
  
  <!-- SEO-optimized header section -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-4">Browse Manga Parodies A-Z</h1>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Discover our complete collection of {data.totalParodies} manga parodies organized alphabetically. 
      Find parodies from popular anime series, games, and comics including Naruto, One Piece, Dragon Ball, and many more.
    </p>
  </header>

  <!-- Search section -->
  <section class="mb-6" aria-label="Search parodies">
    <label for="parody-search" class="block text-sm font-medium mb-2">
      Search through {data.totalParodies} parodies:
    </label>
    <input
      id="parody-search"
      type="text"
      bind:value={$searchQuery}
      placeholder="Search parodies by name..."
      class="w-full p-3 border rounded-lg bg-white text-black dark:bg-black dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      aria-describedby="search-results-info"
    />
    {#if isSearching}
      <p id="search-results-info" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {searchResultsCount} parodies found for "{$searchQuery}"
      </p>
    {/if}
  </section>

  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main content -->
    <div class="flex-1">
      {#if Object.keys($filteredGrouped).length === 0}
        <div class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-300">
            No parodies found matching "{$searchQuery}". Try a different search term.
          </p>
        </div>
      {:else}
        {#each Object.entries($filteredGrouped).sort(([a], [b]) => a.localeCompare(b)) as [letter, parodies]}
          <section id={letter} class="mb-12 scroll-mt-20" aria-labelledby="section-{letter}">
            <h2 id="section-{letter}" class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">
              {letter}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-300 ml-2">
                ({parodies.length} {parodies.length === 1 ? 'parody' : 'parodies'})
              </span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {#each parodies as parody}
                <a
                  href={`/browse/parodies/${parody.slug}`}
                  class="block p-3 border rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  aria-label="View {parody.name} parody"
                >
                  <span class="font-medium">{parody.name}</span>
                </a>
              {/each}
            </div>
          </section>
        {/each}
      {/if}
    </div>

    <!-- Alphabet navigation -->
    <aside class="lg:w-16 lg:sticky lg:top-20 lg:self-start" aria-label="Alphabet navigation">
      <nav class="flex flex-row lg:flex-col items-center justify-center lg:justify-start gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <h3 class="sr-only">Quick navigation by letter</h3>
        {#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('') as char}
          {@const hasContent = data.availableLetters.includes(char)}
          <button
            type="button"
            on:click={() => scrollToSection(char)}
            class="text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center transition-colors
              {hasContent 
                ? 'hover:bg-pink-500 hover:text-white text-pink-600 dark:text-pink-400' 
                : 'text-gray-400 cursor-not-allowed'}"
            disabled={!hasContent}
            aria-label="Jump to section {char}"
            title={hasContent ? `Jump to ${char}` : `No parodies starting with ${char}`}
          >
            {char}
          </button>
        {/each}
      </nav>
    </aside>
  </div>

  <!-- SEO footer content -->
  <footer class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
    <div class="prose dark:prose-invert max-w-none">
      <h2 class="text-xl font-semibold mb-4">About Manga Parodies</h2>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Our extensive collection features parodies from the most popular anime, manga, games, and comics. 
        Whether you're looking for classic series like Naruto, Dragon Ball, and One Piece, or newer titles, 
        you'll find high-quality parody content organized for easy browsing.
      </p>
      <p class="text-gray-600 dark:text-gray-300">
        Use the alphabetical navigation to quickly find parodies, or search by name to discover specific content. 
        All parodies are carefully categorized and regularly updated with new releases.
      </p>
    </div>
  </footer>
</main>

<style>
  .scroll-mt-20 {
    scroll-margin-top: 5rem;
  }
  
  /* Smooth scrolling for the entire page */
  :global(html) {
    scroll-behavior: smooth;
  }
  
  /* Focus styles for better accessibility */
  button:focus-visible,
  a:focus-visible {
    outline: 2px solid #ec4899;
    outline-offset: 2px;
  }
</style>