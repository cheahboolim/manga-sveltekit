<script lang="ts">
  export let data: {
    type: string;
    slug: string;
    name: string;
    comics: {
      id: string;
      title: string;
      slug: string;
      featureImage: string;
      author: { name: string };
    }[];
    page: number;
    totalPages: number;
  };
</script>

<main class="container mx-auto px-4 py-12">
  <h1 class="text-3xl font-bold mb-6 capitalize">
    Browse {data.type} ➝ <span class="text-pink-500">{data.name}</span>
  </h1>

  {#if data.comics.length > 0}
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      {#each data.comics as comic}
        <a href={`/comic/${comic.slug}`} class="block hover:opacity-90">
          <img
            src={comic.featureImage}
            alt={comic.title}
            class="w-full h-auto rounded shadow"
            loading="lazy"
          />
          <p class="mt-2 text-sm font-medium text-white text-center">{comic.title}</p>
        </a>
      {/each}
    </div>
  {:else}
    <p class="text-muted-foreground">No manga found.</p>
  {/if}

  {#if data.totalPages > 1}
    <div class="flex justify-center gap-4 mt-8">
      {#if data.page > 1}
        <a
          href={`/browse/${data.type}/${data.slug}?page=${data.page - 1}`}
          class="px-4 py-2 text-white rounded hover:bg-[#ff1493]/90"
          style="background-color: #ff1493"
        >
          ← Previous
        </a>
      {/if}

      {#if data.page < data.totalPages}
        <a
          href={`/browse/${data.type}/${data.slug}?page=${data.page + 1}`}
          class="px-4 py-2 text-white rounded hover:bg-[#ff1493]/90"
          style="background-color: #ff1493"
        >
          Next →
        </a>
      {/if}
    </div>
  {/if}
</main>
