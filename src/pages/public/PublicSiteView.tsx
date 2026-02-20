import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * PUBLIC SITE VIEWER
 * Fetches only published versions from versioned architecture.
 * No emojis.
 */

export function PublicSiteView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) loadPublishedSite();
  }, [slug]);

  const loadPublishedSite = async () => {
    setLoading(true);
    try {
      // 1. Fetch site by slug with PUBLISHED status and join version
      const { data: site, error: siteError } = await supabase
        .from('templeteria_sites')
        .select('*, version:published_version_id(*)')
        .eq('slug', slug)
        .eq('status', 'PUBLISHED')
        .maybeSingle();

      if (siteError) throw siteError;

      if (!site) {
        setError('Pagina nao encontrada ou nao publicada');
        return;
      }

      if (!site.version) {
        setError('Site sem versao publicada configurada');
        return;
      }

      // site.version is the result of the join on templeteria_site_versions
      setSchema(site.version.schema_json);
    } catch (err: any) {
      console.error('Public View Error:', err);
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
        <AlertCircle className="h-16 w-16 text-slate-200" />
        <div className="space-y-2">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-900 italic">
            Pagina indisponivel
          </h2>
          <p className="text-slate-400 font-medium max-w-xs uppercase text-[10px] tracking-widest leading-relaxed">
            {error}
          </p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao Inicio
        </button>
      </div>
    );
  }

  return <SiteRenderer schema={schema} />;
}
