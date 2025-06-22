<script lang="ts">
  import { writable, derived } from 'svelte/store';
  import { seo } from '$lib/seo';

  export let data: {
    grouped: Record<string, { id: string; name: string; slug: string }[]>;
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
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // SEO
  seo.set({
    title: 'Browse Languages A-Z | SusManga',
    description: 'Browse manga by translation language. Available in English, Japanese, Chinese, and more.',
    canonical: 'https://susmanga.com/p/languages'
  });
</script>

<style>
  .sticky-nav {
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }
</style>

<main class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">Search Languages</h1>
  <input
    type="text"
    bind:value={$searchQuery}
    placeholder="Search languages..."
    class="w-full p-2 border rounded mb-6 bg-white text-black dark:bg-black dark:text-white"
  />

  <div class="flex flex-col md:flex-row gap-8">
    <!-- Language List -->
    <div class="flex-1">
      {#each Object.entries($filteredGrouped) as [letter, languages]}
        <section id={letter} class="mb-8">
          <h2 class="text-xl font-bold mb-2">{letter}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {#each languages as language}
              <a
                href={`/browse/languages/${language.slug}`}
                class="block p-2 border rounded hover:bg-pink-500 hover:text-white transition"
              >
                {language.name}
              </a>
            {/each}
          </div>
        </section>
      {/each}
    </div>

    <!-- Sticky A-Z Scroll -->
    <div class="sticky-nav hidden md:block w-12">
      <nav class="flex flex-col items-center gap-2">
        {#each 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('') as char}
          <button
            on:click={() => scrollToSection(char)}
            class="text-sm font-bold hover:text-pink-500"
          >
            {char}
          </button>
        {/each}
      </nav>
    </div>
  </div>
</main>
