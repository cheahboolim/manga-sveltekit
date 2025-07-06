/* eslint-disable prettier/prettier */
// src/routes/comic/[slug]/read/+page.server.ts
import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load({ params, url: _url }) {
  const slug = params.slug;

  // 1) Look up manga_id via slug
  const { data: slugRow, error: slugErr } = await supabase
    .from('slug_map')
    .select('manga_id')
    .eq('slug', slug)
    .single();
  if (slugErr || !slugRow) throw error(404, 'Manga not found');

  const mangaId = slugRow.manga_id;

  // 2) Fetch the manga's basic info (using your existing schema)
  const { data: manga, error: mangaErr } = await supabase
    .from('manga')
    .select('id, title, feature_image_url')
    .eq('id', mangaId)
    .single();
  if (mangaErr || !manga) throw error(404, 'Manga record missing');

  // 3) Fetch tag IDs from the join table (keeping original approach)
  const { data: tagRows, error: tagErr } = await supabase
    .from('manga_tags')
    .select('tag_id')
    .eq('manga_id', mangaId);
  if (tagErr) throw error(500, 'Failed to load tags');
  const tagIds = (tagRows || []).map((r) => r.tag_id);

  // 4) Fetch tag names separately if we have tag IDs
  let tagNames: string[] = [];
  if (tagIds.length > 0) {
    const { data: tags, error: tagsErr } = await supabase
      .from('tags')
      .select('name')
      .in('id', tagIds);
    if (!tagsErr && tags) {
      tagNames = tags.map((tag) => tag.name);
    }
  }

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
        .map(item => ({ ...item, _sort: Math.random() }))
        .sort((a, b) => a._sort - b._sort)
        .slice(0, RANDOM_LIMIT)
        .map(({ _sort, ...item }) => item);
    }
  }

  const finalRandomManga = randomManga || fallbackRandomManga || [];

  // Get slugs for the random manga
  const randomMangaIds = finalRandomManga.map((m: { id: string }) => m.id);
  let randomComics = [];
  
  if (randomMangaIds.length > 0) {
    const { data: randomSlugs, error: randomSlugError } = await supabase
      .from('slug_map')
      .select('slug, manga_id')
      .in('manga_id', randomMangaIds);

    if (!randomSlugError && randomSlugs) {
      // Combine random manga with slugs
      randomComics = finalRandomManga.map((item: { id: string; title: string; feature_image_url: string }) => ({
        id: item.id,
        title: item.title,
        slug: randomSlugs.find((s) => s.manga_id === item.id)?.slug ?? '',
        featureImage: item.feature_image_url,
        author: { name: 'Sus Manga Hentai' }
      }));
    }
  }

  // 7) Generate comprehensive SEO metadata on server-side
  const baseTitle = manga.title;
  const siteTitle = "SusManga";
  const separator = " | ";
  
  // More descriptive and unique titles
  const seoTitle = pageNum === 1
    ? `Read ${baseTitle} Online Free - Chapter ${pageNum}${separator}${siteTitle}`
    : `${baseTitle} - Page ${pageNum} Online Reader${separator}${siteTitle}`;

  // Rich description with more context
  const seoDescription = pageNum === 1
    ? `Read ${baseTitle} manga online for free at SusManga. High quality translated manga with fast updates.${tagNames.length > 0 ? ` Available genres: ${tagNames.slice(0, 3).join(', ')}.` : ''}`
    : `Continue reading ${baseTitle} - Page ${pageNum} at SusManga. Free online manga reader with high quality images and fast loading.`;

  // Canonical URL
  const canonical = `https://susmanga.com/comic/${slug}/read${
    pageNum > 1 ? `?page=${pageNum}` : ''
  }`;

  // Pagination links
  const prev = pageNum > 1
    ? `/comic/${slug}/read${pageNum - 1 === 1 ? '' : `?page=${pageNum - 1}`}`
    : undefined;

  const next = pageNum < totalPages
    ? `/comic/${slug}/read?page=${pageNum + 1}`
    : undefined;

  // Open Graph and Twitter metadata
  const ogImage = pages[0]?.image_url || manga.feature_image_url || '/default-manga-cover.jpg';
  
  // JSON-LD structured data for better SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ComicSeries",
    "name": manga.title,
    "description": seoDescription,
    "url": `https://susmanga.com/comic/${slug}`,
    "image": ogImage,
    "genre": tagNames,
    "numberOfEpisodes": totalPages,
    "publisher": {
      "@type": "Organization",
      "name": siteTitle,
      "url": "https://susmanga.com"
    }
  };

  return {
    slug,
    manga: {
      id: manga.id,
      title: manga.title,
      tagIds,
      tagNames
    },
    images: pages.map((p) => p.image_url),
    currentPage: pageNum,
    totalPages,
    randomComics,
    // Comprehensive SEO metadata for server-side rendering
    seo: {
      title: seoTitle,
      description: seoDescription,
      canonical,
      prev,
      next,
      keywords: [...tagNames, manga.title, 'manga', 'read online', 'free manga'].join(', '),
      ogImage,
      jsonLd
    }
  };
}