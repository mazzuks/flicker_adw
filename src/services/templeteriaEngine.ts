import { supabase } from '../lib/supabase';

/**
 * TEMPLETERIA ENGINE SERVICE
 * Closing the loop: Generate -> Save -> Version.
 * No emojis.
 */

export const templeteriaEngine = {
  async generateSiteDraft(payload: {
    client_id: string;
    siteName: string;
    businessType: string;
    tone: string;
    palette: string;
    sections: string[];
  }) {
    // 1. Call Edge Function
    const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
      'templeteria-generate',
      {
        body: payload,
      }
    );

    if (aiError) throw aiError;

    // 2. Create Site entry
    const slug = `${payload.siteName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.random().toString(36).substring(7)}`;
    const { data: site, error: siteError } = await supabase
      .from('templeteria_sites')
      .insert({
        client_id: payload.client_id,
        name: payload.siteName,
        slug,
        status: 'DRAFT',
      })
      .select()
      .single();

    if (siteError) throw siteError;

    // 3. Create Version 1
    const { error: verError } = await supabase.from('templeteria_site_versions').insert({
      site_id: site.id,
      client_id: payload.client_id,
      version: 1,
      template_json: aiResponse.template,
      notes: 'AI generated draft',
    });

    if (verError) throw verError;

    return site;
  },

  async refineSite(payload: {
    siteId: string;
    client_id: string;
    currentTemplate: any;
    instruction: string;
    scope: 'GLOBAL' | 'PAGE' | 'BLOCK';
    targetId?: string;
  }) {
    // 1. Call Refine Edge Function
    const { data: aiResponse, error: aiError } = await supabase.functions.invoke(
      'templeteria-refine',
      {
        body: payload,
      }
    );

    if (aiError) throw aiError;

    // 2. Save new version
    const { data: lastVersion } = await supabase
      .from('templeteria_site_versions')
      .select('version')
      .eq('site_id', payload.siteId)
      .order('version', { ascending: false })
      .limit(1)
      .single();

    const nextVer = (lastVersion?.version || 0) + 1;

    const { error: verError } = await supabase.from('templeteria_site_versions').insert({
      site_id: payload.siteId,
      client_id: payload.client_id,
      version: nextVer,
      template_json: aiResponse.template,
      notes: 'AI refinement',
    });

    if (verError) throw verError;

    return aiResponse.template;
  },

  async publishSite(siteId: string, versionId: string) {
    const { error } = await supabase
      .from('templeteria_sites')
      .update({
        status: 'PUBLISHED',
        published_version_id: versionId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', siteId);

    if (error) throw error;
  },
};
