import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import { Loader2, AlertCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

/**
 * SHAREABLE PREVIEW VIEWER
 * Validates a temporal token and renders the LATEST version of a site.
 * Used for sharing drafts without publishing.
 * No emojis.
 */

export function PublicPreviewView() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug && token) loadPreviewSite();
    else if (!token) {
       setError('Token de acesso nao fornecido');
       setLoading(false);
    }
  }, [slug, token]);

  const loadPreviewSite = async () => {
    setLoading(true);
    try {
      // 1. Fetch site with token and slug validation
      const { data: site, error: siteError } = await supabase
        .from('templeteria_sites')
        .select('id, preview_expires_at')
        .eq('slug', slug as string)
        .eq('preview_token', token as string)
        .maybeSingle();

      if (siteError) throw siteError;

      if (!site) {
        setError('Link de preview invalido ou expirado');
        return;
      }

      // 2. Double check expiration
      if (new Date(site.preview_expires_at) < new Date()) {
         setError('Este link de preview ja expirou');
         return;
      }

      // 3. Fetch LATEST version (regardless of publish status)
      const { data: version, error: verError } = await supabase
        .from('templeteria_site_versions')
        .select('schema_json')
        .eq('site_id', site.id)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (verError || !version) {
        setError('Falha ao carregar rascunho');
        return;
      }

      setSchema(version.schema_json);
    } catch (err: any) {
      console.error('Preview View Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !schema) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8 text-center">
        <ShieldAlert className="h-16 w-16 text-red-100" />
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Acesso Restrito
          </h2>
          <p className="text-slate-400 font-bold max-w-xs uppercase text-[10px] tracking-widest leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 hover:text-blue-800 transition-all italic"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Inicio
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
       <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] bg-amber-900 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl opacity-80 backdrop-blur-md">
          Modo Visualizacao de Rascunho
       </div>
       <SiteRenderer schema={schema} />
    </div>
  );
}
