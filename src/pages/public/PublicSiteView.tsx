import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { templeteriaService } from '../../services/templeteria';

/**
 * PUBLIC SITE VIEWER
 * Fetches the frozen published snapshot from templeteria_sites.
 * Safe for production: immutable even if current draft changes.
 * No emojis.
 */

export function PublicSiteView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [schema, setSchema] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadPublishedSite();
    }
  }, [slug]);

  const loadPublishedSite = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      // 1. Fetch site data using centralized service
      const site = await templeteriaService.getPublishedBySlug(slug);

      if (!site) {
        setError('Pagina nao encontrada ou nao publicada');
        return;
      }

      if (!site.published_schema_json) {
        setError('O snapshot desta pagina ainda nao foi gerado');
        return;
      }

      setSchema(site.published_schema_json);
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
          <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Pagina indisponivel
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

  return <SiteRenderer schema={schema} />;
}
