import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import {
  Settings2,
  RefreshCw,
  Monitor,
  Smartphone,
  ArrowLeft,
  Palette,
  Layout as LayoutIcon,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { templeteriaEngine } from '../../services/templeteriaEngine';

export function TempleteriaRefiner() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { currentClientId } = useAuth();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [schema, setSchema] = useState<any>(null);
  const [site, setSite] = useState<any>(null);

  useEffect(() => {
    if (siteId) {
      loadSiteData();
    }
  }, [siteId]);

  const loadSiteData = async () => {
    setLoading(true);
    try {
      const { data: siteData } = await supabase
        .from('templeteria_sites')
        .select('*')
        .eq('id', siteId)
        .single();

      const { data: versionData } = await supabase
        .from('templeteria_site_versions')
        .select('*')
        .eq('site_id', siteId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (siteData) setSite(siteData);
      if (versionData) setSchema(versionData.template_json);
    } catch (err) {
      console.error('Error loading site:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!siteId || !site) return;
    setSaving(true);
    try {
      // Get current version id
      const { data: version } = await supabase
        .from('templeteria_site_versions')
        .select('id')
        .eq('site_id', siteId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (version) {
        await templeteriaEngine.publishSite(siteId, version.id);
        alert('Site publicado com sucesso');
      }
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (!schema)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold uppercase tracking-tight">Projeto nao encontrado</h2>
        <Button onClick={() => navigate('/app/overview')}>Voltar</Button>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in flex-col bg-[#F1F5F9] duration-500">
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="rounded-xl p-2 transition-all hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-sm font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Refino de Projeto
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">
              Ajustes Finais
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center rounded-xl bg-slate-100 p-1">
          <button
            onClick={() => setViewMode('desktop')}
            className={`rounded-lg p-2.5 transition-all ${viewMode === 'desktop' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Monitor className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`rounded-lg p-2.5 transition-all ${viewMode === 'mobile' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
          >
            <Smartphone className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            className="gap-2 text-[11px] font-black uppercase tracking-widest"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Re-Gerar
          </Button>
          <Button
            onClick={handlePublish}
            isLoading={saving}
            className="flex items-center gap-2 bg-blue-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            <ShieldCheck className="h-4 w-4" /> Aprovar Publicacao
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 overflow-y-auto border-r border-slate-200 bg-white p-6 space-y-10">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-[0.2em] text-slate-400">
              <Palette className="h-3.5 w-3.5" /> Identidade
            </h3>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold text-slate-600">Cor Principal</span>
                <div className="flex gap-2">
                  <div
                    className="h-10 w-10 rounded-lg border border-slate-100"
                    style={{ backgroundColor: schema.theme.palette || schema.theme.primaryColor }}
                  />
                  <input
                    type="text"
                    readOnly
                    value={schema.theme.palette || schema.theme.primaryColor}
                    className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-3 text-xs font-bold uppercase"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-[0.2em] text-slate-400">
              <LayoutIcon className="h-3.5 w-3.5" /> Secoes
            </h3>
            <div className="space-y-2">
              {schema.pages[0].blocks?.map((s: any, i: number) => (
                <div
                  key={i}
                  className="group flex cursor-pointer items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4 transition-all hover:border-blue-200"
                >
                  <span className="text-xs font-bold uppercase tracking-tight text-slate-600">
                    {s.type}
                  </span>
                  <Settings2 className="h-4 w-4 text-slate-300 group-hover:text-blue-500" />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex flex-1 justify-center overflow-y-auto bg-slate-100 p-12 scrollbar-hide">
          <div
            className={`h-fit min-h-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl transition-all duration-500 ${viewMode === 'mobile' ? 'w-[375px] min-h-[667px]' : 'w-full max-w-5xl'}`}
          >
            <SiteRenderer schema={schema} />
          </div>
        </main>
      </div>
    </div>
  );
}
