// src/routes/p/parodies/+page.server.ts
import type { PageServerLoad } from './$types';
import type { Parody } from '$lib/types';

export const load: PageServerLoad = async ({ locals }) => {
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

  return {
    grouped
  };
};
