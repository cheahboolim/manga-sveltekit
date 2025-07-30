import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

// A simple utility to convert a name into a URL-friendly slug
function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-') // Replace spaces with -
		.replace(/[^\w-]+/g, '') // Remove all non-word chars
		.replace(/--+/g, '-'); // Replace multiple - with single -
}

export const load: PageServerLoad = async ({ locals }) => {
	const { supabase } = locals;

	// Fetch all tags, ordered alphabetically for easy management
	const { data: tags, error } = await supabase
		.from('tags')
		.select('id, name, slug')
		.order('name', { ascending: true });

	if (error) {
		console.error('Error loading tags:', error);
		return fail(500, { message: 'Could not fetch tags from the database.' });
	}

	return {
		tags: tags ?? []
	};
};

export const actions: Actions = {
	// Action to update a tag's name and slug
	updateTag: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();

		const id = formData.get('id') as string;
		const name = formData.get('name') as string;

		if (!id || !name) {
			return fail(400, { message: 'Invalid request. ID and new name are required.' });
		}

		const slug = slugify(name);

		const { error } = await supabase.from('tags').update({ name, slug }).eq('id', id);

		if (error) {
			// Handle potential duplicate name/slug errors gracefully
			if (error.code === '23505') {
				return fail(409, { message: `The tag name "${name}" already exists.` });
			}
			return fail(500, { message: `Failed to update tag: ${error.message}` });
		}

		return { success: true, message: 'Tag updated successfully.' };
	},

	// Action to delete a tag
	deleteTag: async ({ request, locals }) => {
		const { supabase } = locals;
		const formData = await request.formData();
		const id = formData.get('id') as string;

		if (!id) {
			return fail(400, { message: 'Invalid request. Tag ID is missing.' });
		}

		const { error } = await supabase.from('tags').delete().eq('id', id);

		if (error) {
			return fail(500, { message: `Failed to delete tag: ${error.message}` });
		}

		return { success: true, message: 'Tag deleted successfully.' };
	}
};