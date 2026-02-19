import { supabase } from '../lib/supabase';

/**
 * 📂 STORAGE SERVICE (DealDocs)
 * Handler para upload e gestão de arquivos reais no bucket 'deal-docs'.
 */

export const storageService = {
  async uploadDoc(file: File, accountId: string, dealId: string) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${accountId}/${dealId}/${fileName}`;

    // 1. Upload para o Bucket
    const { error: uploadError } = await supabase.storage.from('deal-docs').upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Registro na tabela deal_docs
    const { error: dbError } = await supabase.from('deal_docs').insert({
      account_id: accountId,
      deal_id: dealId,
      name: file.name,
      storage_path: filePath,
      file_type: file.type,
      file_size: file.size,
    });

    if (dbError) throw dbError;

    return { filePath };
  },

  async getDocs(dealId: string) {
    const { data, error } = await supabase
      .from('deal_docs')
      .select('*')
      .eq('deal_id', dealId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },
};
