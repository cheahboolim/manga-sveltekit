<script lang="ts">
  export let images: string[] = [];
  export let comicSlug: string;

  let visibleCount = 8;
  
  $: visibleImages = images.slice(0, visibleCount);
  $: hasMore = visibleCount < images.length;

  function loadMore() {
    visibleCount = Math.min(visibleCount + 8, images.length);
  }
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  {#each visibleImages as imgUrl, i}
    <a href={`/comic/${comicSlug}/${i + 1}`} title={`Page ${i + 1}`}>
      <img
        src={imgUrl}
        alt={`Preview page ${i + 1}`}
        class="w-full rounded hover:opacity-80 transition"
        loading="lazy"
      />
    </a>
  {/each}
</div>

{#if hasMore}
  <div class="flex justify-center mt-6">
    <button
      on:click={loadMore}
      class="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors font-medium"
    >
      Load More Pages
    </button>
  </div>
{/if}