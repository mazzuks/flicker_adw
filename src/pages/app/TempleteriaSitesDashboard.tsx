import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { templeteriaService } from '../../services/templeteria';
import { slugUtils } from '../../lib/slugUtils';
import { Button, Badge, EmptyState } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import {
  Globe,
  Plus,
  Search,
  ExternalLink,
  Copy,
  Rocket,
  Clock,
  Layout,
  ChevronRight,
  FileEdit,
  MoreVertical,
  Archive,
  RefreshCw,
  Edit3,
  Check,
  AlertCircle,
  Share2
} from 'lucide-react';

/**
 * 🪄 TEMPLETERIA SITES DASHBOARD (NEW)
 * Full management for client projects: List, Filter, Duplicate, Archive, Publish.
 * No emojis. Enterprise Grade.
 */

export function TempleteriaSitesDashboard() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const [sites, setSites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Slug Edit State
  const [editingSlugId, setEditingSlugId] = useState<string | null>(null);
  const [newSlug, setNewSlug] = useState('');
  const [slugStatus, setSlugStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  useEffect(() => {
    if (profile?.account_id) loadSites();
  }, [profile?.account_id]);

  const loadSites = async () => {
    setLoading(true);
    try {
      if (!profile?.account_id) return;
      // Fetch all including archived if tab is 'archived' or 'all'
      const includeArchived = activeTab === 'all' || activeTab === 'archived';
      const data = await templeteriaService.listSites(profile.account_id, includeArchived);
      setSites(data);
    } catch (err) {
      console.error('Error loading sites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (siteId: string) => {
    if (!profile?.account_id || !profile?.id) return;
    setActionLoading(siteId);
    try {
      await templeteriaService.duplicateSite(siteId, profile.account_id, profile.id);
      await loadSites();
    } catch (err: any) {
      alert(`Erro ao duplicar: ${err.message}`);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchive = async (siteId: string) => {
    if (!window.confirm('Deseja realmente arquivar este projeto?')) return;
    try {
      await templeteriaService.updateSiteInfo(siteId, { status: 'archived' });
      await loadSites();
    } catch (err: any) {
      alert(`Erro ao arquivar: ${err.message}`);
    }
  };

  const handlePublish = async (siteId: string) => {
    setPublishingId(siteId);
    try {
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
    alert('Link copiado!');
  };

  const startEditSlug = (site: any) => {
    setEditingSlugId(site.id);
    setNewSlug(site.slug);
    setSlugStatus('available');
  };

  const validateAndSaveSlug = async () => {
    if (!editingSlugId || slugStatus !== 'available') {
        setEditingSlugId(null);
        return;
    }
    try {
      await templeteriaService.updateSiteInfo(editingSlugId, { slug: slugUtils.slugify(newSlug) });
      setEditingSlugId(null);
      await loadSites();
    } catch (e) {
      alert("Erro ao salvar slug.");
    }
  };

  useEffect(() => {
    if (!editingSlugId || !newSlug) return;
    const delay = setTimeout(async () => {
      setSlugStatus('checking');
      const available = await slugUtils.isSlugAvailable(slugUtils.slugify(newSlug), editingSlugId);
      setSlugStatus(available ? 'available' : 'taken');
    }, 400);
    return () => clearTimeout(delay);
  }, [newSlug, editingSlugId]);

  const filteredSites = sites.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === 'all' 
        ? s.status !== 'archived' 
        : s.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: sites.filter(s => s.status !== 'archived').length,
    draft: sites.filter((s) => s.status === 'draft').length,
    published: sites.filter((s) => s.status === 'published').length,
    lastActivity: sites[0]?.updated_at || sites[0]?.created_at || null,
  };

  if (loading && sites.length === 0)
    return (
      <div className="p-10 animate-pulse space-y-8 bg-[#F8FAFC] min-h-screen">
        <div className="h-10 bg-slate-200 rounded-xl w-1/4" />
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-3xl" />)}
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
            Sites
          </h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] mt-3 italic leading-none">
            Gerencie seus sites, versoes e publicacao
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={loadSites}
             className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm"
           >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <Button
             onClick={() => navigate('/app/templeteria/wizard')}
             className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 px-8 py-6 h-auto rounded-2xl font-black uppercase tracking-widest gap-3 transition-all hover:scale-105 active:scale-95"
           >
             <Plus className="w-5 h-5" /> Criar Novo Site
           </Button>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MiniStat label="Projetos" value={String(stats.total)} icon={Layout} color="text-blue-600" bg="bg-blue-50" />
        <MiniStat label="Rascunhos" value={String(stats.draft)} icon={FileEdit} color="text-amber-500" bg="bg-amber-50" />
        <MiniStat label="No Ar" value={String(stats.published)} icon={Rocket} color="text-emerald-500" bg="bg-emerald-50" />
        <MiniStat 
          label="Ultima Edicao" 
          value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString('pt-BR') : '--'} 
          icon={Clock} 
          color="text-slate-400" 
          bg="bg-slate-50" 
        />
      </div>

      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            {(['all', 'draft', 'published', 'archived'] as const).map(tab => (
               <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                  {tab === 'all' ? 'Ativos' : tab}
               </button>
            ))}
         </div>
         <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar por nome ou slug..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-bold uppercase outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
         </div>
      </div>

      {/* LIST */}
      {filteredSites.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
           {filteredSites.map((site) => (
             <div key={site.id} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:border-blue-100 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-all ${site.status === 'published' ? 'bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white' : site.status === 'archived' ? 'bg-slate-200 text-slate-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white'}`}>
                      <Globe className="w-7 h-7" />
                   </div>
                   <div>
                      <h3 className="text-base font-black text-slate-900 uppercase italic tracking-tight flex items-center gap-2 leading-none">
                        {site.name}
                        <button onClick={() => {
                          const n = prompt("Novo nome do site:", site.name);
                          if(n) templeteriaService.updateSiteInfo(site.id, { name: n }).then(() => loadSites());
                        }} className="p-1 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-blue-600 transition-all"><Edit3 className="w-3.5 h-3.5" /></button>
                      </h3>
                      <div className="flex items-center gap-3 mt-2">
                         {editingSlugId === site.id ? (
                            <div className="flex items-center gap-2 animate-in slide-in-from-left-2">
                               <input 
                                 autoFocus
                                 className={`bg-slate-50 border-2 rounded-lg px-2 py-1 text-[10px] font-bold outline-none uppercase ${slugStatus === 'taken' ? 'border-red-200 text-red-500' : 'border-blue-100 text-blue-600'}`}
                                 value={newSlug}
                                 onChange={e => setNewSlug(e.target.value)}
                                 onBlur={validateAndSaveSlug}
                                 onKeyDown={e => e.key === 'Enter' && validateAndSaveSlug()}
                               />
                               {slugStatus === 'checking' && <RefreshCw className="w-3 h-3 animate-spin text-slate-300" />}
                               {slugStatus === 'available' && <Check className="w-3 h-3 text-emerald-500" />}
                               {slugStatus === 'taken' && <AlertCircle className="w-3 h-3 text-red-500" title="Slug ja em uso" />}
                            </div>
                         ) : (
                            <span className="text-[10px] font-bold text-slate-400 tracking-widest cursor-pointer hover:text-blue-600 flex items-center gap-1.5" onClick={() => startEditSlug(site)}>
                               <Globe className="w-3 h-3" /> /s/{site.slug}
                            </span>
                         )}
                         <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                         <Badge variant={site.status === 'published' ? 'success' : 'neutral'} className="text-[8px] px-2 py-0 uppercase font-black">
                            {site.status}
                         </Badge>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-3">
                   <Button 
                      variant="secondary" 
                      onClick={() => navigate(`/app/refiner/${site.id}`)}
                      className="gap-2 px-6 border-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-600 font-bold uppercase text-[10px]"
                   >
                      Abrir Refiner <ChevronRight className="w-3.5 h-3.5" />
                   </Button>
                   
                   {site.status === 'published' ? (
                      <>
                        <button 
                          onClick={() => window.open(`/s/${site.slug}`, '_blank')}
                          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"
                        >
                           <ExternalLink className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => copyToClipboard(site.slug)}
                          className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all"
                        >
                           <Copy className="w-4 h-4" />
                        </button>
                      </>
                   ) : site.status !== 'archived' ? (
                      <Button 
                        onClick={() => handlePublish(site.id)}
                        isLoading={publishingId === site.id}
                        className="bg-slate-900 text-white hover:bg-blue-600 gap-2 px-8 shadow-lg font-bold uppercase text-[10px]"
                      >
                         <Rocket className="w-4 h-4" /> Publicar
                      </Button>
                   ) : null}

                   <div className="relative group/menu">
                      <button className="p-3 text-slate-300 hover:text-slate-900 transition-all"><MoreVertical className="w-5 h-5" /></button>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto transition-all z-20 overflow-hidden">
                         <button onClick={() => handleSharePreview(site.id)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-slate-50 flex items-center gap-3">
                            <Share2 className="w-3.5 h-3.5" /> Compartilhar Preview
                         </button>
                         <button onClick={() => handleDuplicate(site.id)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 flex items-center gap-3 border-t border-slate-50">
                            <Copy className="w-3.5 h-3.5" /> Duplicar
                         </button>
                         {site.status !== 'archived' && (
                            <button onClick={() => handleArchive(site.id)} className="w-full text-left px-5 py-3 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 flex items-center gap-3 border-t border-slate-50">
                               <Archive className="w-3.5 h-3.5" /> Arquivar
                            </button>
                         )}
                      </div>
                   </div>
                </div>
                
                {actionLoading === site.id && (
                   <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center z-10">
                      <RefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
                   </div>
                )}
             </div>
           ))}
        </div>
      ) : (
        <EmptyState 
           title="Nenhum site encontrado" 
           description="Voce ainda nao possui sites nesta categoria."
           icon={Globe}
           actionLabel="CRIAR PRIMEIRO SITE"
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">{label}</p>
          <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{value}</p>
       </div>
       <div className={`p-4 rounded-2xl ${bg} ${color} shadow-inner group-hover:scale-110 transition-all`}>
          <Icon className="w-6 h-6" />
       </div>
    </Card>
  );
}
