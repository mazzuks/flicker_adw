import { supabase } from '../lib/supabase';

/**
 * TEMPLETERIA ENGINE SERVICE
 * Unified API for site generation, refinement and publishing.
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
    // 1. Call real Edge Function
    const { data, error } = await supabase.functions.invoke('templeteria-generate', {
      body: payload
    });

    if (error) throw error;
    if (!data || !data.siteId) throw new Error('Invalid response from AI generator');

    return data; // Returns { siteId, slug, schema }
  },

  async refineSite(payload: {
    siteId: string;
    client_id: string;
    instruction: string;
  }) {
    // 1. Call real Refine Edge Function
    const { data, error } = await supabase.functions.invoke('templeteria-refine', {
      body: payload
    });

    if (error) throw error;
    return data; // Returns { schema }
  },

  async publishSite(siteId: string) {
    const { data, error } = await supabase.functions.invoke('templeteria-publish', {
      body: { siteId }
    });

    if (error) throw error;
    return data; // Returns { success, slug }
  }
};
