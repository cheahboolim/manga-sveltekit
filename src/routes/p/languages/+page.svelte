<script lang="ts">
	export let data: {
		grouped: Record<string, { id: number; name: string; slug: string }[]>;
	};
</script>

<svelte:head>
	<title>Languages – Browse by Language | SusManga</title>
	<meta name="description" content="Explore manga by language on SusManga. Browse your favorite content in English, Japanese, and more." />
	<link rel="canonical" href="https://susmanga.com/p/languages" />
</svelte:head>

<div class="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto text-white">
	<h1 class="text-3xl font-bold mb-6">Languages</h1>

	{#each Object.entries(data.grouped) as [letter, languages]}
		<section class="mb-8">
			<h2 class="text-2xl font-semibold mb-2">{letter}</h2>
			<ul class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
				{#each languages as lang}
					<li>
						<a
							class="block p-2 rounded hover:bg-white/10 transition"
							href={`/language/${lang.slug}`}
						>
							{lang.name}
						</a>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</div>
