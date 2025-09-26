import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=31536000, immutable' });
  const supabase = locals.supabase;

  const { data: characters, error } = await supabase
    .from('characters')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !characters) {
    console.error('Error loading characters:', error);
    return {
      grouped: {},
      totalCharacters: 0,
      availableLetters: [],
      seo: {
        title: 'Browse Hentai Characters | Sus Manga',
        description: 'Browse hentai characters alphabetically',
        canonical: `https://susmanga.com${url.pathname}`
      }
    };
  }

  // Group characters by first letter (A-Z or '#')
  const grouped: Record<string, { id: number; name: string; slug: string | null }[]> = {};

  for (const character of characters) {
    const first = character.name[0]?.toUpperCase();
    const letter = /^[A-Z]$/.test(first) ? first : '#';

    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(character);
  }

  // Enhanced SEO data
  const totalCharacters = characters.length;
  const availableLetters = Object.keys(grouped).sort();
  const popularCharacters = characters.slice(0, 15).map(c => c.name).join(', ');

  return {
    grouped,
    totalCharacters,
    availableLetters,
    seo: {
      title: `Browse ${totalCharacters}+ Hentai Characters A-Z | Sus Manga`,
      description: `Explore ${totalCharacters} hentai characters organized alphabetically. Find your favorite characters from various hentai series. Popular characters: ${popularCharacters.toLowerCase()}.`,
      canonical: `https://susmanga.com${url.pathname}`,
      keywords: `hentai characters, anime characters, ${popularCharacters.toLowerCase()}, hentai cast, character list`,
      ogTitle: `${totalCharacters}+ Hentai Characters | Browse A-Z`,
      ogDescription: `Complete collection of hentai characters organized alphabetically. Discover characters from your favorite series.`,
      ogImage: 'https://susmanga.com/images/characters-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hentai Characters',
        description: `Browse our comprehensive collection of ${totalCharacters} hentai characters organized alphabetically`,
        url: `https://susmanga.com${url.pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: totalCharacters,
          itemListElement: characters.slice(0, 25).map((character, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'Person',
              name: character.name,
              url: `https://susmanga.com/character/${character.slug}`,
              inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Hentai Characters'
              }
            }
          }))
        },
        breadcrumb: {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://susmanga.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Browse',
              item: 'https://susmanga.com/browse'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: 'Characters',
              item: `https://susmanga.com${url.pathname}`
            }
          ]
        }
      }
    }
  };
};