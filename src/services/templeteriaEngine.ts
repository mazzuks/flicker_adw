import { supabase } from '../lib/supabase';

/**
 * 🪄 TEMPLETERIA AI ENGINE (Edge Function Client)
 * Handles site generation and refinement calls.
 */

export const templeteriaEngine = {
  async generateSite(wizardData: any, accountId: string, companyId: string) {
    // 1. Initialize Site Record
    const { data, error } = await supabase.rpc('init_templeteria_site', {
      p_company_id: companyId,
      p_wizard_data: wizardData,
    });

    if (error) throw error;
    const siteId = data;

    // 2. Call Edge Function (OpenAI logic)
    // Note: This will be implemented in the next turn as an actual Edge Function
    const { data: aiData, error: aiError } = await supabase.functions.invoke('templeteria-gen', {
      body: { siteId, wizardData, accountId },
    });

    if (aiError) {
      console.warn('Edge Function not found, using fallback local generator...');
      return this.localFallbackGen(siteId, wizardData);
    }

    return aiData;
  },

  async localFallbackGen(siteId: string, wizardData: any) {
    // Basic structural generation for dev mode
    const schema = {
      metadata: { title: wizardData[11] || 'Novo Projeto', description: wizardData[1] },
      theme: { primaryColor: wizardData[6] || '#2563eb', font: 'Inter' },
      pages: [
        {
          id: 'home',
          sections: [
            {
              type: 'hero',
              content: {
                headline: wizardData[1],
                subheadline: wizardData[4],
                ctaText: 'Saiba Mais',
              },
            },
            {
              type: 'features',
              content: { items: [{ title: wizardData[7], desc: 'Qualidade garantida Adworks.' }] },
            },
          ],
        },
      ],
    };

    await supabase
      .from('templeteria_sites')
      .update({
        site_schema: schema,
        status: 'refining',
      })
      .eq('id', siteId);

    return schema;
  },
};
