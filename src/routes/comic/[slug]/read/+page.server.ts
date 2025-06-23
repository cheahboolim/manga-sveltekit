/* eslint-disable prettier/prettier */
// src/routes/comic/[slug]/read/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load({ params, url: _url }) {
  const slug = params.slug;

  // 1) Look up manga_id via slug_map
  const { data: slugRow, error: slugErr } = await supabase
    .from('slug_map')
    .select('manga_id')
    .eq('slug', slug)
    .single();
  if (slugErr || !slugRow) throw error(404, 'Manga not found');

  const mangaId = slugRow.manga_id;

  // 2) Fetch the manga's basic info
  const { data: manga, error: mangaErr } = await supabase
    .from('manga')
    .select('id, title')
    .eq('id', mangaId)
    .single();
  if (mangaErr || !manga) throw error(404, 'Manga record missing');

  // 3) Fetch tag IDs from the join table
  const { data: tagRows, error: tagErr } = await supabase
    .from('manga_tags')
    .select('tag_id')
    .eq('manga_id', mangaId);
  if (tagErr) throw error(500, 'Failed to load tags');
  const tagIds = tagRows!.map((r) => r.tag_id);

  // 4) Pagination parameters
  const pageNum = Number(_url.searchParams.get('page') ?? '1');
  const IMAGES_PER_PAGE = 3;
  const offset = (pageNum - 1) * IMAGES_PER_PAGE;

  // 5) Pull that page's images
  const { data: pages, error: pagesErr, count } = await supabase
    .from('pages')
    .select('image_url', { count: 'exact' })
    .eq('manga_id', mangaId)
    .order('page_number', { ascending: true })
    .range(offset, offset + IMAGES_PER_PAGE - 1);
  if (pagesErr || !pages) throw error(500, 'Failed to load pages');

  const totalImages = count ?? pages.length;
  const totalPages = Math.ceil(totalImages / IMAGES_PER_PAGE);

  // 6) Fetch 8 random comics for the "Hot Now" widget
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
    manga: {
      id: manga.id,
      title: manga.title,
      tagIds
    },
    images: pages.map((p) => p.image_url),
    currentPage: pageNum,
    totalPages,
    randomComics
  };
}