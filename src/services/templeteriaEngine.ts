import { supabase } from '../lib/supabase';

/**
 * TEMPLETERIA ENGINE SERVICE
 * Production implementation without mocks or naming inconsistencies.
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
    // Calling the standardized Edge Function name
    const { data, error } = await supabase.functions.invoke('templeteria-generate', {
      body: payload
    });

    if (error) throw error;
    if (!data || !data.siteId) throw new Error('AI Engine failed to generate site ID');

    return data; // { siteId, slug, schema }
  },

  async refineSite(payload: {
    siteId: string;
    client_id: string;
    instruction: string;
  }) {
    const { data, error } = await supabase.functions.invoke('templeteria-refine', {
      body: payload
    });

    if (error) throw error;
    return data; // { schema }
  },

  async publishSite(siteId: string) {
    const { data, error } = await supabase.functions.invoke('templeteria-publish', {
      body: { siteId }
    });

    if (error) throw error;
    return data; // { success, slug }
  }
};
