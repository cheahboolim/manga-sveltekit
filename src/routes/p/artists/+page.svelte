<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
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

  let scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Inject SEO
  seo.set({
    title: 'Browse Artists A-Z | SusManga',
    description: 'Discover manga by your favorite artists. Browse through an A-Z index of all available manga artists on SusManga.',
    canonical: 'https://susmanga.com/p/artists'
  });
</script>

<main class="max-w-6xl mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-4">Search Artists</h1>
  <input
    type="text"
    bind:value={$searchQuery}
    placeholder="Search artists..."
    class="w-full p-2 border rounded mb-6 bg-white text-black dark:bg-black dark:text-white"
  />

  <div class="flex flex-col md:flex-row gap-8">
    <!-- Artist List -->
    <div class="flex-1">
      {#each Object.entries($filteredGrouped) as [letter, artists]}
        <section id={letter} class="mb-8">
          <h2 class="text-xl font-bold mb-2">{letter}</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {#each artists as artist}
              <a
                href={`/browse/artists/${artist.slug}`}
                class="block p-2 border rounded hover:bg-pink-500 hover:text-white transition"
              >
                {artist.name}
              </a>
            {/each}
          </div>
        </section>
      {/each}
    </div>

    <!-- Sticky A-Z Nav -->
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

<style>
  .sticky-nav {
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
  }
</style>
