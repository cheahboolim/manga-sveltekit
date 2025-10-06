<script lang="ts">
    import ComicPreview from '$lib/components/ComicPreview.svelte';
    import SimilarManga from '$lib/components/SimilarManga.svelte';
    import MetaGroup from '$lib/components/MetaGroup.svelte';
    import RandomPost from '$lib/components/RandomPost.svelte';
    import ImageErrorRefreshButton from '$lib/components/ImageErrorRefreshButton.svelte';
    import { goto } from '$app/navigation';
    import AAdsMiddleBanner from '$lib/components/aads/AAdsMiddleBanner.svelte'
    import AAdsBanner from '$lib/components/aads/AAdsBanner.svelte'
    import { trackContentConsumption } from '$lib/exoclick-tracking'
    import { onMount } from 'svelte'

    export let data;
    const { slug, comic, meta } = data;

    let featureImageError = false;

    onMount(() => {
        // Track content consumption when user views a comic
        trackContentConsumption();
    });

    function refreshFeatureImage() {
        goto(`/comic/${slug}`, { invalidateAll: true });
    }
</script>

<svelte:head>
    <title>{meta.title}</title>
    <meta name="description" content={meta.description} />
    <meta name="keywords" content={meta.keywords} />
    <link rel="canonical" href={meta.canonical} />
    <meta name="robots" content={meta.robots} />

    <!-- Open Graph -->
    <meta property="og:title" content={meta.ogTitle} />
    <meta property="og:description" content={meta.ogDescription} />
    <meta property="og:image" content={meta.ogImage} />
    <meta property="og:url" content={meta.ogUrl} />

    <!-- Twitter -->
    <meta name="twitter:card" content={meta.twitterCard} />
    <meta name="twitter:title" content={meta.twitterTitle} />
    <meta name="twitter:description" content={meta.twitterDescription} />
    <meta name="twitter:image" content={meta.twitterImage} />

    <!-- Structured Data -->
    <script type="application/ld+json">{meta.structuredData}</script>
</svelte:head>

<main class="container mx-auto px-4 py-8">
    <div class="max-w-6xl mx-auto space-y-8">
        <!-- Main comic info section with side-by-side layout on desktop -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <!-- Left side: Feature Image -->
            <div class="space-y-4">
                {#if comic.feature_image_url}
                    <a href={`/comic/${slug}/1`} class="block">
                        <img
                            src={comic.feature_image_url}
                            alt={comic.title}
                            class="w-full rounded-lg hover:opacity-90 transition shadow-lg"
                            width="600"
                            height="900"
                            on:error={() => (featureImageError = true)}
                        />
                    </a>
                    <ImageErrorRefreshButton show={featureImageError} onRefresh={refreshFeatureImage} />
                {/if}
            </div>

            <!-- Right side: Metadata and Actions - Sticky on desktop -->
            <div class="lg:sticky lg:top-8 space-y-6">
                <div>
                    <h1 class="text-3xl lg:text-4xl font-bold mb-4">{comic.title}</h1>
                    
                    {#if comic.artists.length}
                        <div class="text-muted-foreground text-sm mb-4 flex items-center gap-2 flex-wrap">
                            <span class="font-semibold">Artists:</span>
                            {#each comic.artists as artist}
                                <a href={`/browse/artists/${artist.slug}`} class="underline hover:text-pink-500">
                                    {artist.name}
                                </a>
                            {/each}
                        </div>
                    {/if}

                    <MetaGroup type="tags" label="Tags" items={comic.tags} />
                    <MetaGroup type="groups" label="Groups" items={comic.groups} />
                    <MetaGroup type="categories" label="Categories" items={comic.categories} />
                    <MetaGroup type="languages" label="Languages" items={comic.languages} />
                    <MetaGroup type="parodies" label="Parodies" items={comic.parodies} />
                    <MetaGroup type="characters" label="Characters" items={comic.characters} />
                </div>

                <!-- Start Reading Button - Full width in meta column -->
                <a href={`/comic/${slug}/1`} class="block">
                    <button
                        class="bg-[#FF1493] hover:bg-[#e01382] text-white text-lg font-bold px-6 py-3 rounded-xl shadow-lg border border-transparent w-full text-center transition"
                    >
                        Start Reading Manga
                    </button>
                </a>
            </div>
        </div>

        <div class="mt-10">
            <AAdsMiddleBanner />
        </div>

        <!-- Preview section -->
        {#if comic.previewImages.length > 0}
            <div>
                <h2 class="text-2xl font-bold mb-4">Preview</h2>
                <ComicPreview images={comic.previewImages} comicSlug={slug} />
            </div>
        {/if}
    </div>

    <SimilarManga tagIds={comic.tags.map(tag => Number(tag.id))} currentMangaId={comic.id} />
    <RandomPost comics={data.randomComics} />
</main>