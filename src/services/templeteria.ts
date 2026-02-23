import { supabase } from '../lib/supabase';

/**
 * 🪄 TEMPLETERIA SERVICE
 * Handles data fetching and persistence for the AI Site Builder.
 * Standardizes access to sites, versions, and public snapshots.
 */

export const templeteriaService = {
  async listSites(accountId: string) {
    const { data, error } = await supabase
      .from('templeteria_sites')
      .select('id, name, slug, status, published_at, updated_at, created_at, published_schema_json')
      .eq('account_id', accountId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSite(siteId: string) {
    // Fetch site + version count
    const { data: site, error: siteError } = await supabase
      .from('templeteria_sites')
      .select('*')
      .eq('id', siteId)
      .single();

    if (siteError) throw siteError;

    const { count, error: countError } = await supabase
      .from('templeteria_site_versions')
      .select('*', { count: 'exact', head: true })
      .eq('site_id', siteId);

    if (countError) throw countError;

    return { ...site, versionCount: count || 0 };
  },

  async listVersions(siteId: string) {
    const { data, error } = await supabase
      .from('templeteria_site_versions')
      .select('id, version, created_at, notes')
      .eq('site_id', siteId)
      .order('version', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getPublishedBySlug(slug: string) {
    const { data, error } = await supabase
      .from('templeteria_sites')
      .select('published_schema_json, published_at, name')
      .eq('slug', slug)
      .eq('status', 'published')
      .maybeSingle();

    if (error) throw error;
    return data;
  }
};
