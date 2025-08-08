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
	import NativeAds from '$lib/components/adsterra/NativeAds.svelte'
  import TrafficStarsAd from '$lib/components/TrafficStarsAd.svelte';
</script>

<svelte:head>
  <title>{data.meta.title}</title>
  <meta name="description" content={data.meta.description} />
  {#if data.meta.prev}
    <link rel="prev" href={data.meta.prev} />
  {/if}
  {#if data.meta.next}
    <link rel="next" href={data.meta.next} />
  {/if}
</svelte:head>

<main class="container mx-auto px-4 py-12">
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

    <div class="mt-10 flex flex-wrap gap-2 justify-center">
      {#each Array(data.totalPages) as _, i}
        {#if data.query}
          <a
            href={`/search?q=${encodeURIComponent(data.query)}&page=${i + 1}`}
            class="px-4 py-2 rounded border border-white text-white hover:bg-white hover:text-black transition"
            class:selected={data.page === i + 1}
          >
            {i + 1}
          </a>
        {/if}
      {/each}
    </div>
  {/if}
  <NativeAds />
</main>
