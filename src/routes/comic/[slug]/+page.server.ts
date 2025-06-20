/* eslint-disable prettier/prettier */
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
		.limit(4)

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
		}
	}
}
