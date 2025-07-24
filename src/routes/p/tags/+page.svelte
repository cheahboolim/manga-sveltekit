<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import { seo } from '$lib/seo';
  import { onMount } from 'svelte';

  export let data: {
    grouped: Record<string, { id: number; name: string; slug: string | null }[]>;
    totalTags: number;
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
  <meta name="author" content="SusManga" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Structured Data -->
  {@html `<script type="application/ld+json">${JSON.stringify(data.seo.structuredData)}</script>`}
</svelte:head>

<main class="max-w-6xl mx-auto px-4 py-8">
  <!-- SEO-optimized header section -->
  <header class="mb-8">
    <h1 class="text-3xl font-bold mb-4">Browse Manga Tags & Categories A-Z</h1>
    <p class="text-gray-600 dark:text-gray-300 mb-4">
      Discover manga by exploring our comprehensive collection of {data.totalTags} tags and categories. 
      Find content by genre, character type, themes, fetishes, and story elements. From popular categories 
      like romance and action to specific tags like yuri, milf, and mindbreak.
    </p>
    <div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <p class="text-sm text-blue-800 dark:text-blue-200">
        <strong>Pro tip:</strong> Use tags to filter manga by exactly what you're looking for. 
        Combine multiple tags for more specific results.
      </p>
    </div>
  </header>

  <!-- Search section -->
  <section class="mb-6" aria-label="Search tags">
    <label for="tag-search" class="block text-sm font-medium mb-2">
      Search through {data.totalTags} tags and categories:
    </label>
    <input
      id="tag-search"
      type="text"
      bind:value={$searchQuery}
      placeholder="Search tags (e.g., yuri, milf, romance, mindbreak)..."
      class="w-full p-3 border rounded-lg bg-white text-black dark:bg-black dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
      aria-describedby="search-results-info"
    />
    {#if isSearching}
      <p id="search-results-info" class="text-sm text-gray-600 dark:text-gray-300 mt-2">
        {searchResultsCount} tags found for "{$searchQuery}"
      </p>
    {/if}
  </section>

  <div class="flex flex-col lg:flex-row gap-8">
    <!-- Main content -->
    <div class="flex-1">
      {#if Object.keys($filteredGrouped).length === 0}
        <div class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-300 mb-4">
            No tags found matching "{$searchQuery}". Try a different search term.
          </p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Popular searches: romance, yuri, milf, action, mindbreak, vanilla
          </p>
        </div>
      {:else}
        {#each Object.entries($filteredGrouped).sort(([a], [b]) => a.localeCompare(b)) as [letter, tags]}
          <section id={letter} class="mb-12 scroll-mt-20" aria-labelledby="section-{letter}">
            <h2 id="section-{letter}" class="text-2xl font-bold mb-4 text-pink-600 dark:text-pink-400">
              {letter}
              <span class="text-sm font-normal text-gray-600 dark:text-gray-300 ml-2">
                ({tags.length} {tags.length === 1 ? 'tag' : 'tags'})
              </span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
              {#each tags as tag}
                <a
                  href={`/browse/tags/${tag.slug}`}
                  class="block p-3 border rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-pink-500 focus:outline-none group"
                  aria-label="Browse manga with {tag.name} tag"
                >
                  <span class="font-medium text-sm group-hover:font-semibold">
                    {tag.name}
                  </span>
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
            title={hasContent ? `Jump to ${char}` : `No tags starting with ${char}`}
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
      <h2 class="text-xl font-semibold mb-4">About Manga Tags & Categories</h2>
      <div class="grid md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 class="font-semibold mb-2 text-pink-600 dark:text-pink-400">Popular Genres</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Romance, Action, Comedy, Drama, Fantasy, Horror, Sci-Fi, Slice of Life, and more traditional manga genres.
          </p>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-pink-600 dark:text-pink-400">Character Types</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            MILF, Loli, Shota, Mature, Teen, School Girl, Office Lady, and various character archetypes.
          </p>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-pink-600 dark:text-pink-400">Relationship Themes</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Yuri (GL), Yaoi (BL), Harem, Netorare (NTR), Vanilla, Cheating, and relationship dynamics.
          </p>
        </div>
        <div>
          <h3 class="font-semibold mb-2 text-pink-600 dark:text-pink-400">Story Elements</h3>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            Mindbreak, Ahegao, Bondage, Tentacles, Monster Girls, and various fetish categories.
          </p>
        </div>
      </div>
      <p class="text-gray-600 dark:text-gray-300 mb-4">
        Our tagging system helps you find exactly the type of manga content you're looking for. 
        Each tag represents a specific theme, genre, character type, or story element found in our collection.
      </p>
      <p class="text-gray-600 dark:text-gray-300">
        Use multiple tags together to narrow down your search and discover new content that matches your preferences. 
        All tags are regularly updated and maintained for accuracy.
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

  /* Enhanced grid for tags (more compact) */
  .grid-cols-5 {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
</style>