<script>
	import { page } from '$app/stores';
</script>

<main class="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-background text-foreground">
	<h1 class="text-6xl font-bold mb-4">
		{$page.status || 404}
	</h1>
	<p class="text-xl mb-6 text-muted-foreground">
		{#if $page.status === 404}
			Oops! The page you're looking for doesn't exist.
		{:else}
			{$page.error?.message || 'Something went wrong.'}
		{/if}
	</p>
	<a href="/">
		<button class="bg-white text-black hover:bg-gray-100 px-4 py-2 rounded transition-colors">
			← Back to Home
		</button>
	</a>
</main>