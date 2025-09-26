import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ locals, url, setHeaders }) => {
  setHeaders({ 'Cache-Control': 'public, max-age=31536000, immutable' });
  const supabase = locals.supabase;

  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !categories) {
    console.error('Error loading categories:', error);
    return {
      grouped: {},
      totalCategories: 0,
      availableLetters: [],
      seo: {
        title: 'Browse Hentai Categories | Sus Manga',
        description: 'Browse hentai categories alphabetically',
        canonical: `https://susmanga.com${url.pathname}`
      }
    };
  }

  // Group categories by first letter (A-Z or '#')
  const grouped: Record<string, { id: number; name: string; slug: string | null }[]> = {};

  for (const category of categories) {
    const first = category.name[0]?.toUpperCase();
    const letter = /^[A-Z]$/.test(first) ? first : '#';

    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(category);
  }

  // Enhanced SEO data
  const totalCategories = categories.length;
  const availableLetters = Object.keys(grouped).sort();
  const popularCategories = categories.slice(0, 15).map(c => c.name).join(', ');

  return {
    grouped,
    totalCategories,
    availableLetters,
    seo: {
      title: `Browse ${totalCategories}+ Hentai Categories A-Z | Sus Manga`,
      description: `Explore ${totalCategories} hentai categories organized alphabetically. Find content by genre, theme, and more. Popular categories: ${popularCategories.toLowerCase()}.`,
      canonical: `https://susmanga.com${url.pathname}`,
      keywords: `hentai categories, hentai genres, ${popularCategories.toLowerCase()}, hentai themes, category list`,
      ogTitle: `${totalCategories}+ Hentai Categories | Browse A-Z`,
      ogDescription: `Complete collection of hentai categories organized alphabetically. Discover content by genre, theme, and more.`,
      ogImage: 'https://susmanga.com/images/categories-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Hentai Categories',
        description: `Browse our comprehensive collection of ${totalCategories} hentai categories organized alphabetically`,
        url: `https://susmanga.com${url.pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: totalCategories,
          itemListElement: categories.slice(0, 25).map((category, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'DefinedTerm',
              name: category.name,
              url: `https://susmanga.com/browse/categories/${category.slug}`,
              inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Hentai Categories'
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
              name: 'Categories',
              item: `https://susmanga.com${url.pathname}`
            }
          ]
        }
      }
    }
  };
};