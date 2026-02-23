import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { SiteRenderer } from '../../components/templeteria/SiteRenderer';
import {
  Settings2,
  Monitor,
  Smartphone,
  ArrowLeft,
  Palette,
  Layout as LayoutIcon,
  ShieldCheck,
  AlertCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { templeteriaEngine } from '../../services/templeteriaEngine';

/**
 * TEMPLETERIA REFINER
 * Loads real versioned schema from DB.
 * No mocks. No emojis.
 */

export function TempleteriaRefiner() {
  const { siteId } = useParams();
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [loading, setLoading] = useState(true);
  const [refining, setRefining] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [schema, setSchema] = useState<any>(null);
  const [site, setSite] = useState<any>(null);
  const [versions, setVersions] = useState<any[]>([]);
  const [currentVersionNumber, setCurrentVersionNumber] = useState<number>(1);
  const [instruction, setInstruction] = useState('');
  const [showRefineModal, setShowRefineModal] = useState(false);

  useEffect(() => {
    if (siteId) loadSiteData();
  }, [siteId]);

  const loadSiteData = async () => {
    setLoading(true);
    try {
      const { data: siteData, error: siteError } = await supabase
        .from('templeteria_sites')
        .select('*')
        .eq('id', siteId as string)
        .single();
      if (siteError) throw siteError;

      const { data: verData, error: verError } = await supabase
        .from('templeteria_site_versions')
        .select('*')
        .eq('site_id', siteId as string)
        .order('version', { ascending: false });
      if (verError) throw verError;

      setSite(siteData);
      setVersions(verData || []);
      
      if (verData && verData.length > 0) {
        setSchema(verData[0].schema_json);
        setCurrentVersionNumber(verData[0].version);
      }
    } catch (err) {
      console.error('Error loading site:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async () => {
    if (!instruction.trim() || !siteId || !profile?.account_id) return;
    setRefining(true);
    try {
      const result = await templeteriaEngine.refineSite({
        siteId,
        instruction,
        account_id: profile.account_id,
      });
      setSchema(result.schema);
      setInstruction('');
      setShowRefineModal(false);
      await loadSiteData(); // Refresh versions
    } catch (err) {
      console.error('Refine error:', err);
      alert('Erro ao ajustar conteudo via IA');
    } finally {
      setRefining(false);
    }
  };

  const handlePublish = async () => {
    if (!siteId || !currentVersionNumber) return;
    setPublishing(true);
    try {
      const result = await templeteriaEngine.publishSite(siteId, currentVersionNumber);
      if (result.success) {
         window.open(`/s/${result.slug}`, '_blank');
         await loadSiteData();
      }
    } catch (err) {
      console.error('Publish error:', err);
      alert('Erro ao publicar versao');
    } finally {
      setPublishing(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );

  if (!site || !schema)
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-50">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900 leading-none">
          Projeto nao encontrado
        </h2>
        <Button onClick={() => navigate('/app/overview')}>Voltar</Button>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[100] flex animate-in fade-in flex-col bg-[#F1F5F9] duration-500 font-sans">
      <header className="flex h-20 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/app/overview')}
            className="rounded-xl p-2 transition-all hover:bg-slate-100"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-sm font-black italic uppercase tracking-tighter text-slate-900 leading-none">
              Refino de Projeto
            </h1>
            <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 leading-none">
              Ajustes Finais de IA
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
            onClick={() => setShowRefineModal(true)}
            className="gap-2 text-[11px] font-black uppercase tracking-widest"
          >
            <MessageSquare className="h-3.5 w-3.5" /> Re-Gerar Texto
          </Button>
          <Button
            onClick={handlePublish}
            isLoading={publishing}
            className="flex items-center gap-2 bg-blue-600 text-[11px] font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
          >
            <ShieldCheck className="h-4 w-4" /> Aprovar Publicacao
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-80 shrink-0 overflow-y-auto border-r border-slate-200 bg-white p-6 space-y-10">
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-[0.2em] text-slate-400 leading-none">
              <Palette className="h-3.5 w-3.5" /> Identidade
            </h3>
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-[11px] font-bold text-slate-600">Cor Principal</span>
                <div className="flex gap-2">
                  <div
                    className="h-10 w-10 rounded-lg border border-slate-100"
                    style={{ backgroundColor: schema.theme?.primaryColor || '#2563eb' }}
                  />
                  <input
                    type="text"
                    readOnly
                    value={schema.theme?.primaryColor || '#2563eb'}
                    className="flex-1 rounded-lg border border-slate-100 bg-slate-50 px-3 text-xs font-bold uppercase"
                  />
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="flex items-center gap-2 text-[10px] font-black italic uppercase tracking-[0.2em] text-slate-400 leading-none">
              <LayoutIcon className="h-3.5 w-3.5" /> Historico
            </h3>
            <div className="space-y-2">
              {versions.map((v: any, i: number) => (
                <div
                  key={v.id}
                  onClick={() => { setSchema(v.schema_json); setCurrentVersionNumber(v.version); }}
                  className={`group flex cursor-pointer items-center justify-between rounded-2xl border p-4 transition-all ${currentVersionNumber === v.version ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100 bg-slate-50 hover:border-blue-200'}`}
                >
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-tight text-slate-900 leading-none">
                      Versao {v.version}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase mt-1 leading-none">{v.notes || 'Ajuste'}</span>
                  </div>
                  {site.published_version === v.version && <Badge variant="success" className="text-[8px]">LIVE</Badge>}
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

      {showRefineModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6">
          <div className="w-full max-w-md animate-in zoom-in-95 rounded-3xl bg-white p-8 shadow-2xl space-y-6 duration-200">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">
              O que deseja ajustar?
            </h3>
            <textarea
              className="h-32 w-full resize-none rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Deixe o texto do heroi mais focado em resultados..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
            <div className="flex gap-3">
              <Button
                variant="secondary"
                className="flex-1"
                onClick={() => setShowRefineModal(false)}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1 bg-blue-600 text-white font-bold uppercase text-[11px]"
                isLoading={refining}
                onClick={handleRefine}
              >
                Ajustar com IA
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
