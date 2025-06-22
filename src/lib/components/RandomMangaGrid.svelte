<script lang="ts">
  export let comics: {
    id: string;
    title: string;
    slug: string;
    featureImage: string;
  }[] = [];
</script>

<section class="px-4 mt-10">
  <h2 class="text-xl font-bold text-foreground mb-4">Hot Right Now</h2>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
    {#each comics as comic (comic.id)}
      <div
        class="bg-card overflow-hidden rounded-lg shadow group hover:shadow-lg transition-shadow duration-200"
      >
        <a href={`/comic/${comic.slug}`}>
          <div class="relative aspect-[3/4] overflow-hidden">
            <img
              src={comic.featureImage || '/placeholder.svg'}
              alt={comic.title}
              class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </a>
        <div class="p-4">
          <a href={`/comic/${comic.slug}`} class="hover:underline">
            <h3 class="font-bold text-foreground truncate">{comic.title}</h3>
          </a>
        </div>
      </div>
    {/each}
  </div>
</section>
