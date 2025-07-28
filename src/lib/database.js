// src/lib/database.js
// Replace this with your actual database connection (e.g., Prisma, Drizzle, etc.)

// Example with a generic SQL database connection
import { createConnection } from 'your-database-library';

const db = createConnection({
	// Your database connection config
});

export async function getMangaPosts(page = 1, search = '', limit = 20) {
	const offset = (page - 1) * limit;
	let query = `
		SELECT id, title, slug, created_at, image_path, 
		       (SELECT COUNT(*) FROM chapters WHERE manga_id = manga.id) as total_chapters
		FROM manga 
	`;
	let countQuery = 'SELECT COUNT(*) as total FROM manga';
	let params = [];
	let countParams = [];

	if (search) {
		query += ' WHERE title ILIKE $1';
		countQuery += ' WHERE title ILIKE $1';
		params = [`%${search}%`, limit, offset];
		countParams = [`%${search}%`];
	} else {
		params = [limit, offset];
	}

	query += ' ORDER BY created_at DESC LIMIT $' + (search ? '2' : '1') + ' OFFSET $' + (search ? '3' : '2');

	const [posts, totalResult] = await Promise.all([
		db.query(query, params),
		db.query(countQuery, countParams)
	]);

	const total = parseInt(totalResult.rows[0].total);
	
	return {
		posts: posts.rows,
		total,
		hasMore: offset + limit < total
	};
}

export async function deleteMangaPost(id) {
	await db.query('BEGIN');
	
	try {
		// Delete chapters first (foreign key constraint)
		await db.query('DELETE FROM chapters WHERE manga_id = $1', [id]);
		
		// Delete the manga post
		await db.query('DELETE FROM manga WHERE id = $1', [id]);
		
		await db.query('COMMIT');
		return true;
	} catch (error) {
		await db.query('ROLLBACK');
		throw error;
	}
}

export async function updateMangaTitle(id, title) {
	const result = await db.query(
		'UPDATE manga SET title = $1, updated_at = NOW() WHERE id = $2 RETURNING id',
		[title, id]
	);
	
	return result.rows.length > 0;
}

export async function getMangaImagePaths(ids) {
	if (ids.length === 0) return [];
	
	const placeholders = ids.map((_, i) => `$${i + 1}`).join(',');
	
	// Get manga cover images
	const mangaQuery = `
		SELECT image_path 
		FROM manga 
		WHERE id IN (${placeholders}) AND image_path IS NOT NULL
	`;
	
	// Get chapter images
	const chapterQuery = `
		SELECT image_path 
		FROM chapters 
		WHERE manga_id IN (${placeholders}) AND image_path IS NOT NULL
	`;
	
	// Get page images if you have them
	const pageQuery = `
		SELECT image_path 
		FROM pages 
		WHERE chapter_id IN (
			SELECT id FROM chapters WHERE manga_id IN (${placeholders})
		) AND image_path IS NOT NULL
	`;
	
	const [mangaImages, chapterImages, pageImages] = await Promise.all([
		db.query(mangaQuery, ids),
		db.query(chapterQuery, ids),
		db.query(pageQuery, ids)
	]);
	
	const allImages = [
		...mangaImages.rows.map(row => row.image_path),
		...chapterImages.rows.map(row => row.image_path),
		...pageImages.rows.map(row => row.image_path)
	];
	
	// Remove duplicates and filter out null values
	return [...new Set(allImages)].filter(Boolean);
}