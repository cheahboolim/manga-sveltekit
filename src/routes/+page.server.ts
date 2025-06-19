/* eslint-disable */
/* prettier-ignore */

import { supabase } from '$lib/supabaseClient';

export async function load({ url }) {
  const PAGE_SIZE = 10;
  const pageParam = parseInt(url.searchParams.get('page') ?? '1', 10);
  const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const { data: manga, error: mangaError, count } = await supabase
    .from('manga')
    .select('id, title, feature_image_url', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (mangaError || !manga) {
    console.error('Error fetching manga:', mangaError);
    throw new Error('Failed to load manga');
  }

  const mangaIds = manga.map((m) => m.id);

  const { data: slugs, error: slugError } = await supabase
    .from('slug_map')
    .select('slug, manga_id')
    .in('manga_id', mangaIds);

  if (slugError || !slugs) {
    console.error('Error fetching slugs:', slugError);
    throw new Error('Failed to load slugs');
  }

  const comics = manga.map((item) => ({
    id: item.id,
    title: item.title,
    slug: slugs.find((s) => s.manga_id === item.id)?.slug ?? '',
    featureImage: item.feature_image_url,
    author: { name: 'Unknown' },
  }));

  return {
    comics,
    total: count ?? 0,
    page,
  };
}
