import { supabase } from '../lib/supabase';

/**
 * 🔗 SLUG UTILS
 * Robust slug generation and validation.
 */

export const slugUtils = {
  /**
   * Transforms a string into a URL-friendly slug.
   */
  slugify(text: string): string {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .normalize('NFD') // Remove accents
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9 -]/g, '') // Remove invalid chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Remove duplicate -
  },

  /**
   * Generates a unique slug by checking against the database.
   * Format: base-slug or base-slug-2, base-slug-3, etc.
   */
  async generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = this.slugify(name);
    let slug = baseSlug;
    let counter = 1;
    let isUnique = false;

    while (!isUnique) {
      const { data } = await supabase
        .from('templeteria_sites')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

      if (!data) {
        isUnique = true;
      } else {
        counter++;
        slug = `${baseSlug}-${counter}`;
      }
    }

    return slug;
  },

  /**
   * Validates if a specific slug is available.
   */
  async isSlugAvailable(slug: string, excludeSiteId?: string): Promise<boolean> {
    if (!slug || slug.length < 3) return false;
    
    let query = supabase
      .from('templeteria_sites')
      .select('id')
      .eq('slug', slug);
    
    if (excludeSiteId) {
      query = query.neq('id', excludeSiteId);
    }

    const { data } = await query.maybeSingle();
    return !data;
  }
};
