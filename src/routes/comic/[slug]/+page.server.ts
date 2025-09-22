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

export const load = async ({ params, url, setHeaders }) => {
  const slug = params.slug
  const refreshParam = url.searchParams.get('refresh')

  // Cache for 1 year at CDN/edge, unless ?refresh=true
  if (refreshParam === 'true') {
    setHeaders({
      'cache-control': 'public, max-age=0, s-maxage=0'
    })
  } else {
    setHeaders({
      'cache-control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400'
    })
  }

  // 1. Get manga ID from slug
  const { data: slugRow, error: slugErr } = await supabase
    .from('slug_map')
    .select('manga_id')
    .eq('slug', slug)
    .single()

  if (slugErr || !slugRow) throw error(404, 'Comic not found')
  const mangaId = slugRow.manga_id

  // 2. Get manga details and all related meta in one go (using joins)
  const { data: manga, error: mangaErr } = await supabase
    .from('manga')
    .select(`
      id,
      title,
      feature_image_url,
      created_at,
      manga_artists: manga_artists(artist_id(id, name, slug)),
      manga_tags: manga_tags(tag_id(id, name, slug)),
      manga_groups: manga_groups(group_id(id, name, slug)),
      manga_categories: manga_categories(category_id(id, name, slug)),
      manga_languages: manga_languages(language_id(id, name, slug)),
      manga_parodies: manga_parodies(parody_id(id, name, slug)),
      manga_characters: manga_characters(character_id(id, name, slug))
    `)
    .eq('id', mangaId)
    .single()

  if (mangaErr || !manga) throw error(404, 'Comic not found')

  // Helper to flatten join arrays
  function flattenMeta<T extends string>(arr: any[], key: T): RelatedMeta[] {
    return (
      arr?.map((row) => row[key])?.filter(Boolean) ?? []
    )
  }

  // 3. Get pages (images)
  const { data: pages, error: pagesErr } = await supabase
    .from('pages')
    .select('image_url')
    .eq('manga_id', mangaId)
    .order('page_number', { ascending: true })

  if (pagesErr) {
    console.error('Error fetching pages:', pagesErr)
  }

  // 4. Get 8 random comics for "Hot Now" widget (single query with join for slugs)
  const RANDOM_LIMIT = 8
  const randomSeed = Math.floor(Math.random() * 1000000)

  let randomComics: any[] = []
  const { data: randomManga, error: randomError } = await supabase
    .rpc('get_random_manga', {
      seed_value: randomSeed / 1000000,
      limit_count: RANDOM_LIMIT,
      offset_count: 0
    })

  if (randomManga && randomManga.length > 0) {
    // Get slugs for these manga in one query
    const randomMangaIds = randomManga.map((m: any) => m.id)
    const { data: randomSlugs } = await supabase
      .from('slug_map')
      .select('slug, manga_id')
      .in('manga_id', randomMangaIds)

    randomComics = randomManga.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: randomSlugs?.find((s) => s.manga_id === item.id)?.slug ?? '',
      featureImage: item.feature_image_url,
      author: { name: 'Unknown' }
    }))
  }

  // SEO meta fields
  const baseUrl = 'https://susmanga.com'
  const canonicalUrl = `${baseUrl}/comic/${slug}`
  const ogImage = manga.feature_image_url || 'https://cdn.susmanga.com/og-image.jpg'
  const description = `Read "${manga.title}" online. ${flattenMeta(manga.manga_tags, 'tag_id').map(t => t.name).join(', ')}. Free manga, doujinshi, hentai, and more on SusManga.`

  // Structured data (JSON-LD for comic)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Book",
    "name": manga.title,
    "image": ogImage,
    "author": flattenMeta(manga.manga_artists, 'artist_id').map(a => a.name),
    "genre": flattenMeta(manga.manga_tags, 'tag_id').map(t => t.name),
    "datePublished": manga.created_at,
    "url": canonicalUrl
  }

  return {
    slug,
    comic: {
      id: manga.id,
      title: manga.title,
      feature_image_url: manga.feature_image_url,
      publishedAt: manga.created_at,
      previewImages: pages?.map((p) => p.image_url) ?? [],
      artists: flattenMeta(manga.manga_artists, 'artist_id'),
      tags: flattenMeta(manga.manga_tags, 'tag_id'),
      groups: flattenMeta(manga.manga_groups, 'group_id'),
      categories: flattenMeta(manga.manga_categories, 'category_id'),
      languages: flattenMeta(manga.manga_languages, 'language_id'),
      parodies: flattenMeta(manga.manga_parodies, 'parody_id'),
      characters: flattenMeta(manga.manga_characters, 'character_id')
    },
    randomComics,
    meta: {
      title: `${manga.title} | SusManga`,
      description,
      canonical: canonicalUrl,
      robots: 'index,follow',
      keywords: [
        manga.title,
        ...flattenMeta(manga.manga_tags, 'tag_id').map(t => t.name),
        ...flattenMeta(manga.manga_artists, 'artist_id').map(a => a.name),
        'manga', 'doujinshi', 'hentai', 'SusManga'
      ].join(', '),
      ogTitle: `${manga.title} | SusManga`,
      ogDescription: description,
      ogImage,
      ogUrl: canonicalUrl,
      twitterCard: 'summary_large_image',
      twitterTitle: `${manga.title} | SusManga`,
      twitterDescription: description,
      twitterImage: ogImage,
      structuredData: JSON.stringify(structuredData)
    }
  }
}