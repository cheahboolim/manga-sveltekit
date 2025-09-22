import { error } from '@sveltejs/kit';
import { supabase } from '$lib/supabaseClient';

export async function load({ params, url, setHeaders }) {
  const slug = params.slug;
  const pageNum = Number(params.page);

  // 1 year CDN cache, unless ?refresh=true
  if (url.searchParams.get('refresh') === 'true') {
    setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=0' });
  } else {
    setHeaders({ 'cache-control': 'public, max-age=0, s-maxage=31536000, stale-while-revalidate=86400' });
  }

  if (isNaN(pageNum) || pageNum < 1) throw error(404, 'Invalid page number');

  // 1) Get manga_id from slug
  const { data: slugRow, error: slugErr } = await supabase
    .from('slug_map')
    .select('manga_id')
    .eq('slug', slug)
    .single();
  if (slugErr || !slugRow) throw error(404, 'Manga not found');
  const mangaId = slugRow.manga_id;

  // 2) Fetch manga info and tags in one go (using joins)
  const { data: manga, error: mangaErr } = await supabase
    .from('manga')
    .select(`
      id,
      title,
      feature_image_url,
      manga_tags: manga_tags(tag_id(id, name))
    `)
    .eq('id', mangaId)
    .single();
  if (mangaErr || !manga) throw error(404, 'Manga record missing');

  const tagIds = manga.manga_tags?.map((r) => r.tag_id.id) ?? [];
  const tagNames = manga.manga_tags?.map((r) => r.tag_id.name) ?? [];

  // 3) Get images for this page (pagination)
  const IMAGES_PER_PAGE = 1;
  const offset = (pageNum - 1) * IMAGES_PER_PAGE;
  const { data: pages, error: pagesErr, count } = await supabase
    .from('pages')
    .select('image_url', { count: 'exact' })
    .eq('manga_id', mangaId)
    .order('page_number', { ascending: true })
    .range(offset, offset + IMAGES_PER_PAGE - 1);
  if (pagesErr || !pages) throw error(500, 'Failed to load pages');

  const totalImages = count ?? pages.length;
  const totalPages = Math.max(1, Math.ceil(totalImages / IMAGES_PER_PAGE));
  if (pageNum > totalPages) throw error(404, 'Page not found');

  // 4) Get 8 random comics for "Hot Now" widget (single query + join for slugs)
  const RANDOM_LIMIT = 8;
  const randomSeed = Math.floor(Math.random() * 1000000);
  let randomComics: any[] = [];
  const { data: randomManga } = await supabase
    .rpc('get_random_manga', {
      seed_value: randomSeed / 1000000,
      limit_count: RANDOM_LIMIT,
      offset_count: 0
    });
  if (randomManga?.length > 0) {
    const randomMangaIds = randomManga.map((m: any) => m.id);
    const { data: randomSlugs } = await supabase
      .from('slug_map')
      .select('slug, manga_id')
      .in('manga_id', randomMangaIds);
    randomComics = randomManga.map((item: any) => ({
      id: item.id,
      title: item.title,
      slug: randomSlugs?.find((s) => s.manga_id === item.id)?.slug ?? '',
      featureImage: item.feature_image_url,
      author: { name: 'Sus Manga Hentai' }
    }));
  }

  // 5) SEO meta
  const baseTitle = manga.title;
  const siteTitle = "SusManga";
  const seoTitle = pageNum === 1
    ? `Read ${baseTitle} Online Free - Chapter ${pageNum} | ${siteTitle}`
    : `${baseTitle} - Page ${pageNum} Online Reader | ${siteTitle}`;
  const seoDescription = pageNum === 1
    ? `Read ${baseTitle} manga online for free at SusManga. High quality translated manga with fast updates.${tagNames.length > 0 ? ` Available genres: ${tagNames.slice(0, 3).join(', ')}.` : ''}`
    : `Continue reading ${baseTitle} - Page ${pageNum} at SusManga. Free online manga reader with high quality images and fast loading.`;
  const canonical = `https://susmanga.com/comic/${slug}/${pageNum}`;
  const prev = pageNum > 1 ? `/comic/${slug}/${pageNum - 1}` : undefined;
  const next = pageNum < totalPages ? `/comic/${slug}/${pageNum + 1}` : undefined;
  const ogImage = pages[0]?.image_url || manga.feature_image_url || '/default-manga-cover.jpg';
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