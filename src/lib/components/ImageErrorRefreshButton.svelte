<script lang="ts">
	export let show = false;
	export let onRefresh: () => void;
</script>

{#if show}
	<div class="text-center mt-4">
		<button
			on:click={onRefresh}
			class="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-4 rounded"
		>
			If image fails to load, click here to refresh
		</button>
	</div>
{/if}
