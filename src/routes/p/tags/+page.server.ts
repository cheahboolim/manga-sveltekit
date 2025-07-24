// src/routes/p/tags/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  const supabase = locals.supabase;

  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !tags) {
    console.error('Error loading tags:', error);
    return { 
      grouped: {},
      totalTags: 0,
      availableLetters: [],
      seo: {
        title: 'Browse Manga Tags | SusManga',
        description: 'Browse manga tags and categories',
        canonical: `https://susmanga.com${url.pathname}`
      }
    };
  }

  // Group tags by first letter (A-Z or '#')
  const grouped: Record<string, { id: number; name: string; slug: string | null }[]> = {};

  for (const tag of tags) {
    const first = tag.name[0]?.toUpperCase();
    const letter = /^[A-Z]$/.test(first) ? first : '#';

    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(tag);
  }

  // Enhanced SEO data
  const totalTags = tags.length;
  const availableLetters = Object.keys(grouped).sort();
  const popularTags = tags.slice(0, 15).map(t => t.name).join(', ');
  
  // Create category-based description
  const sampleTags = tags.slice(0, 20).map(t => t.name.toLowerCase());
  const categories = {
    genres: sampleTags.filter(tag => ['romance', 'comedy', 'action', 'drama', 'fantasy', 'sci-fi', 'horror'].some(genre => tag.includes(genre))),
    demographics: sampleTags.filter(tag => ['milf', 'loli', 'shota', 'mature', 'teen'].some(demo => tag.includes(demo))),
    themes: sampleTags.filter(tag => ['yuri', 'yaoi', 'harem', 'netorare', 'mindbreak', 'vanilla'].some(theme => tag.includes(theme)))
  };

  return {
    grouped,
    totalTags,
    availableLetters,
    seo: {
      title: `Browse ${totalTags}+ Manga Tags & Categories A-Z | SusManga`,
      description: `Explore ${totalTags} manga tags organized alphabetically. Find content by genre, theme, character type, and fetish. Popular tags: ${popularTags.toLowerCase()}.`,
      canonical: `https://susmanga.com${url.pathname}`,
      keywords: `manga tags, hentai tags, doujin categories, ${popularTags.toLowerCase()}, manga genres, adult manga tags, anime tags`,
      ogTitle: `${totalTags}+ Manga Tags | Browse by Category`,
      ogDescription: `Complete collection of manga tags and categories. Filter by genre, character type, themes, and more to find exactly what you're looking for.`,
      ogImage: 'https://susmanga.com/images/tags-og.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Manga Tags & Categories',
        description: `Browse our comprehensive collection of ${totalTags} manga tags and categories organized alphabetically`,
        url: `https://susmanga.com${url.pathname}`,
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: totalTags,
          itemListElement: tags.slice(0, 25).map((tag, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
              '@type': 'DefinedTerm',
              name: tag.name,
              url: `https://susmanga.com/browse/tags/${tag.slug}`,
              inDefinedTermSet: {
                '@type': 'DefinedTermSet',
                name: 'Manga Tags'
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
              name: 'Tags',
              item: `https://susmanga.com${url.pathname}`
            }
          ]
        }
      }
    }
  };
};