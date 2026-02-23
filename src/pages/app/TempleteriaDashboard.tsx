import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Rocket,
  Clock,
  Layout,
  MoreVertical,
  ChevronRight,
  ShieldCheck,
  FileEdit,
} from 'lucide-react';

/**
 * 🪄 TEMPLETERIA DASHBOARD
 * Central management for all AI-generated sites.
 */

export function TempleteriaDashboard() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published'>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);

  useEffect(() => {
    loadSites();
  }, []);

  const loadSites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('templeteria_sites')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setSites(data || []);
    } catch (err) {
      console.error('Error loading sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (siteId: string) => {
    setPublishingId(siteId);
    try {
      // Get the latest version number for this site
      const { data: ver } = await supabase
        .from('templeteria_site_versions')
        .select('version')
        .eq('site_id', siteId)
        .order('version', { ascending: false })
        .limit(1)
        .single();

      if (!ver) throw new Error('Nenhuma versao encontrada para publicar');

      const { error } = await supabase.functions.invoke('templeteria-publish', {
        body: { siteId, version: ver.version },
      });

      if (error) throw error;
      await loadSites();
    } catch (err: any) {
      alert(`Erro ao publicar: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  const copyToClipboard = (slug: string) => {
    const url = `${window.location.origin}/s/${slug}`;
    navigator.clipboard.writeText(url);
    alert('Link copiado para a area de transferencia!');
  };

  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' || s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: sites.length,
    draft: sites.filter((s) => s.status === 'draft').length,
    published: sites.filter((s) => s.status === 'published').length,
    lastActivity: sites[0]?.updated_at || sites[0]?.created_at || null,
  };

  if (loading)
    return (
      <div className="p-10 animate-pulse space-y-8">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
        <div className="grid grid-cols-4 gap-6">
          <div className="h-32 bg-slate-100 rounded-3xl" />
          <div className="h-32 bg-slate-100 rounded-3xl" />
          <div className="h-32 bg-slate-100 rounded-3xl" />
          <div className="h-32 bg-slate-100 rounded-3xl" />
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Gerenciador de Sites
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 italic">
            Ecossistema Templeteria Engine
          </p>
        </div>
        <Button
          onClick={() => navigate('/app/templeteria/wizard')}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 px-8 py-6 h-auto rounded-2xl font-black uppercase tracking-widest gap-3 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" /> Criar Novo Site
        </Button>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniStat label="Total de Projetos" value={String(stats.total)} icon={Layout} color="text-blue-600" bg="bg-blue-50" />
        <MiniStat label="Em Rascunho" value={String(stats.draft)} icon={FileEdit} color="text-amber-500" bg="bg-amber-50" />
        <MiniStat label="Publicados" value={String(stats.published)} icon={Rocket} color="text-emerald-500" bg="bg-emerald-50" />
        <MiniStat 
          label="Ultima Atividade" 
          value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString('pt-BR') : '--'} 
          icon={Clock} 
          color="text-slate-400" 
          bg="bg-slate-50" 
        />
      </div>

      {/* FILTERS & TABS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            {(['all', 'draft', 'published'] as const).map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {tab === 'all' ? 'Todos' : tab}
               </button>
            ))}
         </div>
         <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input 
              type="text"
              placeholder="Buscar por nome ou slug..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* SITES LIST */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
           {filteredSites.map((site) => (
             <div key={site.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${site.status === 'published' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-50 text-slate-400'}`}>
                      <Globe className="w-7 h-7" />
                   </div>
                   <div>
                      <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight">{site.name}</h3>
                      <div className="flex items-center gap-3 mt-1.5">
                         <span className="text-[10px] font-bold text-slate-400 tracking-widest">/s/{site.slug}</span>
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         <Badge variant={site.status === 'published' ? 'success' : 'neutral'} className="text-[8px] px-2 py-0">
                            {site.status.toUpperCase()}
                         </Badge>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <Button 
                      variant="secondary" 
                      onClick={() => navigate(`/app/refiner/${site.id}`)}
                      className="gap-2 px-6 border-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                   >
                      Editar <ChevronRight className="w-3.5 h-3.5" />
                   </Button>
                   
                   {site.status === 'published' ? (
                      <>
                        <button 
                          onClick={() => window.open(`/s/${site.slug}`, '_blank')}
                          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all" title="Ver Site"
                        >
                           <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(site.slug)}
                          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all" title="Copiar Link"
                        >
                           <Copy className="w-4 h-4" />
                        </button>
                      </>
                   ) : (
                      <Button 
                        onClick={() => handlePublish(site.id)}
                        isLoading={publishingId === site.id}
                        className="bg-slate-900 text-white hover:bg-blue-600 gap-2 px-8 shadow-lg shadow-slate-200"
                      >
                         <Rocket className="w-4 h-4" /> Publicar
                      </Button>
                   )}
                   <button className="p-3 text-slate-300 hover:text-slate-900 transition-all"><MoreVertical className="w-5 h-5" /></button>
                </div>
             </div>
           ))}
        </div>
      ) : (
        <EmptyState 
           title="Nenhum site encontrado" 
           description="Voce ainda nao possui sites gerados ou publicados neste filtro."
           icon={Globe}
           actionLabel="CRIAR MEU PRIMEIRO SITE"
           onAction={() => navigate('/app/templeteria/wizard')}
        />
      )}
    </div>
  );
}

function MiniStat({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="p-8 border border-slate-100 shadow-sm rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all">
       <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{label}</p>
          <p className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">{value}</p>
       </div>
       <div className={`p-4 rounded-2xl ${bg} ${color} shadow-inner group-hover:scale-110 transition-all`}>
          <Icon className="w-6 h-6" />
       </div>
    </Card>
  );
}
