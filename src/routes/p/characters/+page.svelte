<script lang="ts">
	export let data: {
		grouped: Record<string, { id: number; name: string; slug: string }[]>;
	};
</script>

<svelte:head>
	<title>Characters – Browse by Name | SusManga</title>
	<meta name="description" content="Browse all characters featured in SusManga. Organized alphabetically for easier discovery." />
	<link rel="canonical" href="https://susmanga.com/p/characters" />
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto text-white">
	<h1 class="text-3xl font-bold mb-6">Characters</h1>

	{#each Object.entries(data.grouped) as [letter, characters]}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-2">{letter}</h2>
			<ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
				{#each characters as character}
					<li>
						<a
							class="block p-2 rounded hover:bg-white/10 transition"
							href={`/character/${character.slug}`}
						>
							{character.name}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
