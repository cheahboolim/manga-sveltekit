/* eslint-disable prettier/prettier */
// src/routes/browse/[type]/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { supabase } from '$lib/supabaseClient';

export const load: PageServerLoad = async ({ params, url }) => {
	const { type, slug } = params;
	const page = Number(url.searchParams.get('page')) || 1;
	const PAGE_SIZE = 10;
	const offset = (page - 1) * PAGE_SIZE;

	// Maps "tags" => "manga_tags", etc.
	const allowed: Record<string, string> = {
		tags: 'manga_tags',
		artists: 'manga_artists',
		categories: 'manga_categories',
		parodies: 'manga_parodies',
		characters: 'manga_characters',
		languages: 'manga_languages',
		groups: 'manga_groups'
	};

	const typeLabels: Record<string, string> = {
		tags: 'Tag',
		artists: 'Artist',
		categories: 'Category',
		parodies: 'Parody',
		characters: 'Character',
		languages: 'Language',
		groups: 'Group'
	};

	if (!(type in allowed)) {
		throw error(404, 'Invalid browse type');
	}

	const joinTable = allowed[type];
	const idField = type.endsWith('ies')
		? type.slice(0, -3) + 'y_id'
		: type.slice(0, -1) + '_id';

	// 1. Fetch the meta tag/category/language/etc. info
	const { data: meta, error: metaErr } = await supabase
		.from(type)
		.select('id, name')
		.eq('slug', slug)
		.single();

	if (metaErr || !meta) {
		throw error(404, 'Browse category not found');
	}

	// 2. Count total manga for pagination
	const { count: total, error: countErr } = await supabase
		.from(joinTable)
		.select('manga_id', { count: 'exact', head: true })
		.eq(idField, meta.id);

	if (countErr) throw error(500, 'Failed to count related manga');

	const totalPages = Math.ceil((total || 0) / PAGE_SIZE);
	const totalManga = total || 0;

	// 3. Get paginated manga IDs
	const { data: rel, error: relErr } = await supabase
		.from(joinTable)
		.select('manga_id')
		.eq(idField, meta.id)
		.order('manga_id')
		.range(offset, offset + PAGE_SIZE - 1);

	if (relErr || !rel?.length) {
		throw error(404, 'No manga found for this page');
	}

	const mangaIds = rel.map((r) => r.manga_id);

	// 4. Fetch manga data
	const { data: manga, error: mangaErr } = await supabase
		.from('manga')
		.select('id, title, feature_image_url')
		.in('id', mangaIds);

	if (mangaErr || !manga) {
		throw error(500, 'Failed to fetch manga data');
	}

	// 5. Fetch slug mappings
	const { data: slugs, error: slugErr } = await supabase
		.from('slug_map')
		.select('slug, manga_id')
		.in('manga_id', mangaIds);

	if (slugErr || !slugs) {
		throw error(500, 'Failed to fetch slug mappings');
	}

	// 6. Map manga and slugs into final result
	const comics = manga.map((item) => ({
		id: item.id,
		title: item.title,
		slug: slugs.find((s) => s.manga_id === item.id)?.slug ?? '',
		featureImage: item.feature_image_url,
		author: { name: 'Unknown' }
	}));

	// Enhanced SEO data
	const typeLabel = typeLabels[type] || type;
	const currentUrl = `https://susmanga.com${url.pathname}${url.search}`;
	const canonicalUrl = page === 1 ? 
		`https://susmanga.com/browse/${type}/${slug}` : 
		`https://susmanga.com/browse/${type}/${slug}?page=${page}`;

	// Generate dynamic descriptions based on type
	const generateDescription = () => {
		const pageInfo = page > 1 ? ` - Page ${page}` : '';
		switch (type) {
			case 'tags':
				return `Browse ${totalManga} manga with ${meta.name} tag${pageInfo}. Find doujinshi and hentai manga featuring ${meta.name.toLowerCase()} content.`;
			case 'artists':
				return `Discover ${totalManga} manga by artist ${meta.name}${pageInfo}. Read all works from this talented manga creator.`;
			case 'parodies':
				return `Read ${totalManga} ${meta.name} parody manga${pageInfo}. Fan-made doujinshi and adult content based on ${meta.name}.`;
			case 'characters':
				return `Find ${totalManga} manga featuring ${meta.name}${pageInfo}. Browse doujinshi with this popular character.`;
			case 'categories':
				return `Explore ${totalManga} manga in ${meta.name} category${pageInfo}. Discover content in this genre.`;
			case 'languages':
				return `Read ${totalManga} manga in ${meta.name}${pageInfo}. Browse content in your preferred language.`;
			case 'groups':
				return `Browse ${totalManga} manga by ${meta.name} group${pageInfo}. Quality translations and releases.`;
			default:
				return `Browse ${totalManga} manga in ${meta.name}${pageInfo}.`;
		}
	};

	return {
		type,
		slug,
		name: meta.name,
		comics,
		page,
		totalPages,
		totalManga,
		typeLabel,
		seo: {
			title: page === 1 ? 
				`${meta.name} ${typeLabel} - ${totalManga} Manga | SusManga` :
				`${meta.name} ${typeLabel} - Page ${page} of ${totalPages} | SusManga`,
			description: generateDescription(),
			canonical: canonicalUrl,
			keywords: `${meta.name.toLowerCase()}, ${type}, manga, doujinshi, hentai, adult manga, ${meta.name.toLowerCase()} manga`,
			ogTitle: `${meta.name} ${typeLabel} - ${totalManga} Manga`,
			ogDescription: generateDescription(),
			ogImage: comics[0]?.featureImage || 'https://susmanga.com/images/browse-og.jpg',
			structuredData: {
				'@context': 'https://schema.org',
				'@type': 'CollectionPage',
				name: `${meta.name} ${typeLabel} Collection`,
				description: generateDescription(),
				url: canonicalUrl,
				mainEntity: {
					'@type': 'ItemList',
					numberOfItems: totalManga,
					itemListElement: comics.map((comic, index) => ({
						'@type': 'ListItem',
						position: (page - 1) * PAGE_SIZE + index + 1,
						item: {
							'@type': 'Book',
							'@id': `https://susmanga.com/comic/${comic.slug}`,
							name: comic.title,
							url: `https://susmanga.com/comic/${comic.slug}`,
							image: comic.featureImage,
							author: {
								'@type': 'Person',
								name: comic.author.name
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
							name: typeLabel + 's',
							item: `https://susmanga.com/p/${type}`
						},
						{
							'@type': 'ListItem',
							position: 4,
							name: meta.name,
							item: canonicalUrl
						}
					]
				}
			}
		}
	};
};