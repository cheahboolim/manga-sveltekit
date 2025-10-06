<script lang="ts">
  export let recent: Array<{ id: number; title: string; slug: string; featureImage: string }> = [];
</script>

{#if recent.length > 0}
  <section class="mb-8">
    <h2 class="text-xl font-bold mb-4 text-pink-500">Recently Viewed Manga</h2>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {#each recent as manga}
        <a href={`/comic/${manga.slug}`} class="block hover:opacity-90">
          <img src={manga.featureImage} alt={manga.title} class="w-full h-auto rounded shadow" loading="lazy" />
          <p class="mt-2 text-sm font-medium text-white text-center">{manga.title}</p>
        </a>
      {/each}
    </div>
  </section>
{/if}
