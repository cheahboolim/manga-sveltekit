/* eslint-disable prettier/prettier */
//src\routes\comic\[slug]\+page.server.ts
import { error } from '@sveltejs/kit'
import { supabase } from '$lib/supabaseClient'

type RelatedMeta = {
	id: string
	name: string
	slug: string
}

type JoinRow<T extends string> = {
	[key in T]: RelatedMeta | null
}

export async function load({ params }) {
	const slug = params.slug

	const { data: slugRow, error: slugErr } = await supabase
		.from('slug_map')
		.select('manga_id')
		.eq('slug', slug)
		.single()

	if (slugErr || !slugRow) throw error(404, 'Comic not found')

	const mangaId = slugRow.manga_id

	const { data: manga, error: mangaErr } = await supabase
		.from('manga')
		.select('id, title, feature_image_url, created_at')
		.eq('id', mangaId)
		.single()

	if (mangaErr || !manga) throw error(404, 'Comic not found')

	const { data: pages } = await supabase
		.from('pages')
		.select('image_url')
		.eq('manga_id', mangaId)
		.order('page_number', { ascending: true })

	async function fetchRelated<T extends string>(
		joinTable: string,
		foreignKey: T
	): Promise<RelatedMeta[]> {
		const { data } = await supabase
			.from(joinTable)
			.select(`${foreignKey}(id, name, slug)`)
			.eq('manga_id', mangaId)

		return (
			((data as JoinRow<T>[] | null)
				?.map((row) => row[foreignKey])
				.filter(Boolean) as RelatedMeta[]) ?? []
		)
	}

	const [artists, tags, groups, categories, languages, parodies, characters] = await Promise.all([
		fetchRelated('manga_artists', 'artist_id'),
		fetchRelated('manga_tags', 'tag_id'),
		fetchRelated('manga_groups', 'group_id'),
		fetchRelated('manga_categories', 'category_id'),
		fetchRelated('manga_languages', 'language_id'),
		fetchRelated('manga_parodies', 'parody_id'),
		fetchRelated('manga_characters', 'character_id')
	])

	// Fetch 8 random comics for the "Hot Now" widget
	const RANDOM_LIMIT = 8;
	const randomSeed = Math.floor(Math.random() * 1000000);

	// Try to use the RPC function for seeded random
	const { data: randomManga, error: randomError } = await supabase
		.rpc('get_random_manga', {
			seed_value: randomSeed / 1000000,
			limit_count: RANDOM_LIMIT,
			offset_count: 0
		});

	// Fallback if RPC doesn't exist
	let fallbackRandomManga;
	if (randomError || !randomManga) {
		console.log('RPC not available, falling back to simple random for hot widget');
		const { data: fallback, error: fallbackError } = await supabase
			.from('manga')
			.select('id, title, feature_image_url')
			.limit(RANDOM_LIMIT * 3); // Get more to shuffle from

		if (fallbackError || !fallback) {
			console.error('Error fetching random manga:', fallbackError);
			fallbackRandomManga = [];
		} else {
			// Shuffle the results client-side
			fallbackRandomManga = fallback
				.map(item => ({ ...item, sort: Math.random() }))
				.sort((a, b) => a.sort - b.sort)
				.slice(0, RANDOM_LIMIT)
				.map(({ sort, ...item }) => item);
		}
	}

	const finalRandomManga = randomManga || fallbackRandomManga || [];

	// Get slugs for the random manga
	const randomMangaIds = finalRandomManga.map((m: any) => m.id);
	let randomComics = [];
	
	if (randomMangaIds.length > 0) {
		const { data: randomSlugs, error: randomSlugError } = await supabase
			.from('slug_map')
			.select('slug, manga_id')
			.in('manga_id', randomMangaIds);

		if (!randomSlugError && randomSlugs) {
			// Combine random manga with slugs
			randomComics = finalRandomManga.map((item: any) => ({
				id: item.id,
				title: item.title,
				slug: randomSlugs.find((s) => s.manga_id === item.id)?.slug ?? '',
				featureImage: item.feature_image_url,
				author: { name: 'Unknown' }
			}));
		}
	}

	return {
		slug,
		comic: {
			id: manga.id,
			title: manga.title,
			feature_image_url: manga.feature_image_url,
			publishedAt: manga.created_at,
			previewImages: pages?.map((p) => p.image_url) ?? [],
			artists,
			tags,
			groups,
			categories,
			languages,
			parodies,
			characters
		},
		randomComics
	}
}