import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const supabase = locals.supabase;

  const { data: tags, error } = await supabase
    .from('tags')
    .select('id, name, slug')
    .order('name', { ascending: true });

  if (error || !tags) {
    console.error('Error loading tags:', error);
    return { grouped: {} };
  }

  // Group tags by first letter (A-Z or '#')
  const grouped: Record<string, { id: number; name: string; slug: string | null }[]> = {};

  for (const tag of tags) {
    const first = tag.name[0]?.toUpperCase();
    const letter = /^[A-Z]$/.test(first) ? first : '#';

    if (!grouped[letter]) grouped[letter] = [];
    grouped[letter].push(tag);
  }

  return { grouped };
};
