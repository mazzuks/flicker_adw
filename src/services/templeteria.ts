import { supabase } from '../lib/supabase';

/**
 * 🪄 TEMPLETERIA SERVICE
 * Handles data fetching and persistence for the AI Site Builder.
 * Standardizes access to sites, versions, and public snapshots.
 */

export const templeteriaService = {
  async listSites(accountId: string, includeArchived = false) {
    let query = supabase
      .from('templeteria_sites')
      .select('id, name, slug, status, published_at, updated_at, created_at, published_schema_json')
      .eq('account_id', accountId);
    
    if (!includeArchived) {
      query = query.neq('status', 'archived');
    }

    const { data, error } = await query.order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getSite(siteId: string) {
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
  },

  async duplicateSite(siteId: string, accountId: string, createdBy: string) {
    // 1. Fetch source site and its latest version
    const { data: sourceSite } = await supabase.from('templeteria_sites').select('*').eq('id', siteId).single();
    const { data: lastVer } = await supabase.from('templeteria_site_versions')
      .select('*').eq('site_id', siteId).order('version', { ascending: false }).limit(1).single();

    if (!sourceSite || !lastVer) throw new Error("Source project not found");

    // 2. Create new site record
    const newName = `${sourceSite.name} (Copy)`;
    const newSlug = `${sourceSite.slug}-copy-${Math.random().toString(36).substring(7)}`;
    
    const { data: newSite, error: siteErr } = await supabase.from('templeteria_sites').insert({
      account_id: accountId,
      created_by: createdBy,
      name: newName,
      slug: newSlug,
      status: 'draft'
    }).select().single();

    if (siteErr) throw siteErr;

    // 3. Create version 1 with copied schema
    const { error: verErr } = await supabase.from('templeteria_site_versions').insert({
      site_id: newSite.id,
      version: 1,
      schema_json: lastVer.schema_json,
      theme_json: lastVer.theme_json,
      created_by: createdBy,
      notes: `Duplicated from ${sourceSite.name}`
    });

    if (verErr) throw verErr;

    return newSite;
  },

  async updateSiteInfo(siteId: string, updates: { name?: string, slug?: string, status?: string }) {
    const { data, error } = await supabase
      .from('templeteria_sites')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', siteId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
