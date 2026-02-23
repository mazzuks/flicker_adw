import { supabase } from '../lib/supabase';

/**
 * TEMPLETERIA ENGINE SERVICE
 * Production implementation with real Edge Function calls and versioning.
 * Unified to use account_id and schema_json.
 * No emojis.
 */

export const templeteriaEngine = {
  async generateSiteDraft(payload: {
    account_id: string;
    siteName: string;
    slug: string;
    businessType: string;
    tone: string;
    palette: string;
    sections: string[];
  }) {
    // 1. Invoke generation edge function
    const { data, error } = await supabase.functions.invoke('templeteria-generate', {
      body: payload
    });

    if (error) throw error;
    if (!data || !data.siteId) throw new Error('AI Engine failed to return site metadata');

    return data; // { siteId, slug, versionId, schema }
  },

  async refineSite(payload: {
    siteId: string;
    account_id: string;
    instruction: string;
  }) {
    // 1. Invoke refinement edge function
    const { data, error } = await supabase.functions.invoke('templeteria-refine', {
      body: payload
    });

    if (error) throw error;
    return data; // { schema, versionId }
  },

  async publishSite(siteId: string, version: number) {
    // 1. Invoke publish edge function
    const { data, error } = await supabase.functions.invoke('templeteria-publish', {
      body: { siteId, version }
    });

    if (error) throw error;
    return data; // { success, slug }
  }
};
