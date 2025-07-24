// src/routes/p/parodies/+page.server.ts
import type { PageServerLoad } from './$types';
import type { Parody } from '$lib/types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const supabase = locals.supabase;

  const { data: parodies, error } = await supabase
    .from('parodies')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !parodies) {
    throw new Error('Failed to load parodies');
  }

  const grouped: Record<string, Parody[]> = {};

  for (const parody of parodies) {
    const firstChar = parody.name.charAt(0).toUpperCase();
    const key = /[A-Z]/.test(firstChar) ? firstChar : '#';
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(parody);
  }

  // Enhanced SEO data
  const totalParodies = parodies.length;
  const availableLetters = Object.keys(grouped).sort();
  const popularParodies = parodies.slice(0, 10).map(p => p.name).join(', ');

  return {
    grouped,
    totalParodies,
    availableLetters,
    seo: {
      title: `Browse ${totalParodies}+ Manga Parodies A-Z | SusManga`,
      description: `Discover manga parodies from ${availableLetters.join(', ')}. Find Naruto, One Piece, Dragon Ball, Attack on Titan, and ${totalParodies - 4}+ more anime, game, and comic parodies.`,
      canonical: `https://susmanga.com${url.pathname}`,
      keywords: 'manga parodies, anime parodies, doujinshi, hentai manga, comic parodies, game parodies, ' + popularParodies.toLowerCase(),
      ogTitle: `${totalParodies}+ Manga Parodies | Browse A-Z`,
      ogDescription: `Complete collection of manga parodies organized alphabetically. Find your favorite anime, game, and comic parodies.`,
      ogImage: 'https://susmanga.com/images/parodies-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Manga Parodies Collection',
        description: `Browse our complete collection of ${totalParodies} manga parodies organized alphabetically`,
        url: `https://susmanga.com${url.pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: totalParodies,
          itemListElement: parodies.slice(0, 20).map((parody, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'CreativeWork',
              name: parody.name,
              url: `https://susmanga.com/browse/parodies/${parody.slug}`
            }
          }))
        }
      }
    }
  };
};