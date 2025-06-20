<script lang="ts">
  export let images: string[] = [];
  export let comicSlug: string;
</script>

<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
  {#each images as imgUrl, i}
    <a href={`/comic/${comicSlug}/read?page=1`} title={`Page ${i + 1}`}>
      <img
        src={imgUrl}
        alt={`Preview page ${i + 1}`}
        class="w-full rounded hover:opacity-80 transition"
        loading="lazy"
      />
    </a>
  {/each}
</div>
