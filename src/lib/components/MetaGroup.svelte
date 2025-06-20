<script lang="ts">
	export let items: { id: string; name: string; slug: string }[] = [];
	export let label: string;
	export let type: string;
</script>

{#if items.length > 0}
	<div class="mt-3">
		<strong>{label}:</strong>
		<div class="flex flex-wrap gap-2 mt-1">
			{#each items as item}
				<a
					href={`/browse/${type}/${item.slug}`}
					class="text-sm px-3 py-1 rounded-full bg-muted text-muted-foreground hover:bg-pink-100"
				>
					{item.name}
				</a>
			{/each}
		</div>
	</div>
{/if}
