import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=31536000, immutable' });
  const supabase = locals.supabase;

  const { data: languages, error } = await supabase
    .from('languages')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !languages) {
    console.error('Error loading languages:', error);
    return {
      grouped: {},
      totalLanguages: 0,
      availableLetters: [],
      seo: {
        title: 'Browse Hentai Languages | Sus Manga',
        description: 'Browse hentai content by language',
        canonical: `https://susmanga.com${url.pathname}`
      }
    };
  }

  // Group languages by first letter (A-Z or '#')
  const grouped: Record<string, { id: number; name: string; slug: string | null }[]> = {};

  for (const language of languages) {
    const first = language.name[0]?.toUpperCase();
    const letter = /^[A-Z]$/.test(first) ? first : '#';

    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(language);
  }

  // Enhanced SEO data
  const totalLanguages = languages.length;
  const availableLetters = Object.keys(grouped).sort();
  const popularLanguages = languages.slice(0, 15).map(l => l.name).join(', ');

  return {
    grouped,
    totalLanguages,
    availableLetters,
    seo: {
      title: `Browse ${totalLanguages}+ Hentai Languages A-Z | Sus Manga`,
      description: `Explore ${totalLanguages} hentai languages organized alphabetically. Find content in your preferred language. Popular languages: ${popularLanguages.toLowerCase()}.`,
      canonical: `https://susmanga.com${url.pathname}`,
      keywords: `hentai languages, ${popularLanguages.toLowerCase()}, hentai translations, language list`,
      ogTitle: `${totalLanguages}+ Hentai Languages | Browse A-Z`,
      ogDescription: `Complete collection of hentai languages organized alphabetically. Discover content in various languages.`,
      ogImage: 'https://susmanga.com/images/languages-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hentai Languages',
        description: `Browse our comprehensive collection of ${totalLanguages} hentai languages organized alphabetically`,
        url: `https://susmanga.com${url.pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: totalLanguages,
          itemListElement: languages.slice(0, 25).map((language, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'DefinedTerm',
              name: language.name,
              url: `https://susmanga.com/language/${language.slug}`,
              inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Hentai Languages'
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
              name: 'Languages',
              item: `https://susmanga.com${url.pathname}`
            }
          ]
        }
      }
    }
  };
};