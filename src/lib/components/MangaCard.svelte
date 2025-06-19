<script lang="ts">
	export let title: string
	export let coverUrl: string
	export let href: string
</script>

<a {href} class="block group">
	<div
		class="aspect-[3/4] overflow-hidden rounded-lg shadow hover:shadow-xl transition-shadow duration-300"
	>
		<img
			src={coverUrl}
			alt={title}
			class="w-full h-full object-cover group-hover:scale-105 transition-transform"
		/>
	</div>
	<p class="mt-2 text-sm font-medium text-center text-gray-900 group-hover:text-primary">
		{title}
	</p>
</a>
