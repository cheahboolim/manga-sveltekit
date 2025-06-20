<script lang="ts">
	import { goto } from '$app/navigation';
</script>

<main class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
	<h1 class="text-4xl font-bold mb-4 text-white">
		🚧 Feature Temporarily Unavailable
	</h1>
	<p class="text-muted-foreground text-lg mb-6">
		This feature is currently under maintenance. Please check back later.
	</p>
	<button
		on:click={() => goto('/')}
		class="text-black bg-white hover:bg-gray-100 px-4 py-2 rounded"
	>
		← Back to Home
	</button>
</main>
