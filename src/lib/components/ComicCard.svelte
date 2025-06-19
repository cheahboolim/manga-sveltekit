<script lang="ts">
	export let title: string;
	export let slug: string;
	export let featureImage: string;
</script>

<div
	class="bg-card rounded-lg overflow-hidden shadow group hover:shadow-lg transition-shadow duration-200"
>
	<a href={`/comic/${slug}`}>
		<div class="relative aspect-[3/4] overflow-hidden">
			<img
				src={featureImage || '/placeholder.svg'}
				alt={title}
				class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
		</div>
	</a>
	<div class="p-4">
		<a href={`/comic/${slug}`} class="hover:underline">
			<h3 class="font-bold text-foreground truncate">{title}</h3>
		</a>
	</div>
</div>
