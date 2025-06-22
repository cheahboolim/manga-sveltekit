<script lang="ts">
  import { onMount } from 'svelte';

  import { supabase } from '$lib/supabaseClient';

  export let tagIds: number[] = [];
  export let currentMangaId: string;

  type SimilarManga = {
    id: string;
    title: string;
    slug: string;
    feature_image_url: string | null;
    commonTags: number;
  };

  let similarManga: SimilarManga[] = [];
  let loading = true;
  let error = '';

  async function loadSimilarManga() {
    if (!tagIds.length) {
      loading = false;
      return;
    }

    try {
      // Get manga that share tags with current manga
      const { data: sharedTagManga, error: sharedError } = await supabase
        .from('manga_tags')
        .select(`
          manga_id,
          manga!inner(id, title, feature_image_url)
        `)
        .in('tag_id', tagIds)
        .neq('manga_id', currentMangaId);

      if (sharedError) throw sharedError;

      if (!sharedTagManga || sharedTagManga.length === 0) {
        // Fallback: get random manga if no similar found
        const { data: randomManga, error: randomError } = await supabase
          .from('manga')
          .select('id, title, feature_image_url')
          .neq('id', currentMangaId)
          .limit(8);

        if (randomError) throw randomError;

        if (randomManga) {
          // Get slugs for random manga
          const mangaIds = randomManga.map(m => m.id);
          const { data: slugData } = await supabase
            .from('slug_map')
            .select('slug, manga_id')
            .in('manga_id', mangaIds);

          similarManga = randomManga.map(manga => ({
            id: manga.id,
            title: manga.title,
            slug: slugData?.find(s => s.manga_id === manga.id)?.slug || '',
            feature_image_url: manga.feature_image_url,
            commonTags: 0
          }));
        }
        loading = false;
        return;
      }

      // Count common tags and group by manga
      const mangaTagCount = new Map<string, { manga: any; count: number }>();
      
      sharedTagManga.forEach(item => {
        const mangaId = item.manga_id;
        if (mangaTagCount.has(mangaId)) {
          mangaTagCount.get(mangaId)!.count++;
        } else {
          mangaTagCount.set(mangaId, {
            manga: item.manga,
            count: 1
          });
        }
      });

      // Convert to array and sort by common tag count, then add some randomness
      const sortedManga = Array.from(mangaTagCount.values())
        .sort((a, b) => {
          // Primary sort by common tags
          if (b.count !== a.count) {
            return b.count - a.count;
          }
          // Secondary sort by random for variety
          return Math.random() - 0.5;
        })
        .slice(0, 8); // Limit to 8 similar manga

      // Get slugs for the similar manga
      const mangaIds = sortedManga.map(item => item.manga.id);
      const { data: slugData, error: slugError } = await supabase
        .from('slug_map')
        .select('slug, manga_id')
        .in('manga_id', mangaIds);

      if (slugError) throw slugError;

      similarManga = sortedManga.map(item => ({
        id: item.manga.id,
        title: item.manga.title,
        slug: slugData?.find(s => s.manga_id === item.manga.id)?.slug || '',
        feature_image_url: item.manga.feature_image_url,
        commonTags: item.count
      }));

    } catch (err) {
      console.error('Error loading similar manga:', err);
      error = 'Failed to load similar manga';
    } finally {
      loading = false;
    }
  }

  function navigateToManga(slug: string) {
    window.location.href = `/comic/${slug}`;
  }

  onMount(() => {
    loadSimilarManga();
  });
</script>

{#if !loading && similarManga.length > 0}
  <section class="mt-12 px-4">
    <h2 class="text-2xl font-bold mb-6">Similar Manga</h2>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {#each similarManga as manga (manga.id)}
        <div class="group">
          <div 
            class="block bg-card overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 cursor-pointer"
            on:click={() => navigateToManga(manga.slug)}
            on:keydown={(e) => e.key === 'Enter' && navigateToManga(manga.slug)}
            tabindex="0"
            role="button"
          >
            <div class="relative aspect-[3/4] overflow-hidden">
              {#if manga.feature_image_url}
                <img
                  src={manga.feature_image_url}
                  alt={manga.title}
                  class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              {:else}
                <div class="w-full h-full bg-gray-200 flex items-center justify-center">
                  <span class="text-gray-500 text-sm">No Image</span>
                </div>
              {/if}
              
              <!-- Overlay with tag count -->
              {#if manga.commonTags > 0}
                <div class="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {manga.commonTags} shared {manga.commonTags === 1 ? 'tag' : 'tags'}
                </div>
              {:else}
                <div class="absolute top-2 right-2 bg-pink-600/80 text-white text-xs px-2 py-1 rounded">
                  Random
                </div>
              {/if}
              
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </div>
            
            <div class="p-3">
              <h3 class="font-medium text-sm leading-tight line-clamp-2 group-hover:text-pink-500 transition-colors">
                {manga.title}
              </h3>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Refresh button -->
    <div class="text-center mt-6">
      <button 
        on:click={loadSimilarManga}
        class="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors text-sm"
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Refresh Recommendations'}
      </button>
    </div>
  </section>
{:else if loading}
  <section class="mt-12 px-4">
    <h2 class="text-2xl font-bold mb-6">Similar Manga</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {#each Array(8) as _}
        <div class="bg-card overflow-hidden rounded-lg shadow animate-pulse">
          <div class="aspect-[3/4] bg-gray-300"></div>
          <div class="p-3">
            <div class="h-4 bg-gray-300 rounded mb-2"></div>
            <div class="h-3 bg-gray-300 rounded w-2/3"></div>
          </div>
        </div>
      {/each}
    </div>
  </section>
{:else if error}
  <section class="mt-12 px-4">
    <h2 class="text-2xl font-bold mb-6">Similar Manga</h2>
    <div class="text-center py-8">
      <p class="text-red-500 mb-4">{error}</p>
      <button 
        on:click={loadSimilarManga}
        class="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  </section>
{/if}

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>