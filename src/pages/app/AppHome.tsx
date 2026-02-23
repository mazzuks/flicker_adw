import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { 
  Globe, 
  TrendingUp, 
  Calendar, 
  FileSpreadsheet, 
  FileText, 
  ClipboardCheck, 
  Activity,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

/**
 * 🏠 APP HOME HUB
 * Entrypoint with role-based shortcuts for both Clients and Operators.
 * Aesthetics: Absolute Fidelity (Enterprise Clean).
 */

export function AppHome() {
  const { profile, isAdworks } = useAuth();
  const navigate = useNavigate();

  const isSuperAdmin = profile?.role_global === 'ADWORKS_SUPERADMIN';

  const clientShortcuts = [
    { label: 'Gerenciador de Sites', desc: 'Crie e edite seus sites com IA', icon: Globe, path: '/app/templeteria', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Gestao Financeira', desc: 'Acompanhe seu faturamento e impostos', icon: TrendingUp, path: '/app/company/finance', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Agenda Fiscal', desc: 'Calendario de obrigacoes e prazos', icon: Calendar, path: '/app/company/agenda-fiscal', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Solicitador de Notas', desc: 'Peca a emissao de NF para clientes', icon: FileSpreadsheet, path: '/app/company/nf-requests', color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Guias DAS', desc: 'Baixe suas guias mensais de imposto', icon: FileText, path: '/app/company/das', color: 'text-red-600', bg: 'bg-red-50' },
  ];

  const operatorShortcuts = [
    { label: 'Gerenciador de Sites', desc: 'Acesso global aos projetos IA', icon: Globe, path: '/app/templeteria', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Fila Fiscal', desc: 'Gestao de chamados e apuracoes', icon: ClipboardCheck, path: '/app/operator/fiscal-queue', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Publicar DAS', desc: 'Envio manual de guias para clientes', icon: FileText, path: '/app/companies', color: 'text-red-600', bg: 'bg-red-50' }, // Redirect to companies to choose
  ];

  const adminShortcuts = [
    { label: 'Admin Business BI', desc: 'Saude financeira do produto', icon: Activity, path: '/app/admin/finance', color: 'text-slate-900', bg: 'bg-slate-100' },
    ...operatorShortcuts
  ];

  const shortcuts = isSuperAdmin ? adminShortcuts : (isAdworks ? operatorShortcuts : clientShortcuts);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* WELCOME SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">Painel Operacional</span>
              <div className="w-1 h-1 bg-slate-200 rounded-full" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{profile?.role_global}</span>
           </div>
           <h1 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">
             Bem-vindo, {profile?.full_name?.split(' ')[0] || 'Usuario'}
           </h1>
           <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em] mt-4 italic leading-none">
             Selecione um modulo para iniciar a execucao
           </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-300">
           <ShieldCheck className="w-5 h-5" />
           <span className="text-[10px] font-black uppercase tracking-widest">Ambiente Criptografado</span>
        </div>
      </div>

      {/* SHORTCUTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {shortcuts.map((item, i) => (
           <button 
             key={i}
             onClick={() => navigate(item.path)}
             className="text-left group transition-all active:scale-[0.98]"
           >
              <Card className="p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 rounded-[2.5rem] h-full flex flex-col justify-between transition-all relative overflow-hidden">
                 <div className={`absolute top-0 right-0 w-32 h-32 ${item.bg} opacity-0 group-hover:opacity-20 rounded-full -mr-16 -mt-16 blur-3xl transition-all`} />
                 
                 <div className="space-y-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shadow-inner group-hover:scale-110 transition-all`}>
                       <item.icon className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-lg font-black text-slate-900 uppercase italic tracking-tight leading-tight">{item.label}</h3>
                       <p className="text-xs font-medium text-slate-400 leading-relaxed uppercase tracking-widest">{item.desc}</p>
                    </div>
                 </div>

                 <div className="mt-10 flex items-center justify-between relative z-10">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] group-hover:text-blue-600 transition-colors">Acessar Modulo</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                       <ChevronRight className="w-4 h-4" />
                    </div>
                 </div>
              </Card>
           </button>
         ))}
      </div>

      {/* FOOTER STATS/INFO */}
      <div className="p-10 bg-slate-900 rounded-[3rem] shadow-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full -ml-32 -mt-32 blur-3xl" />
         <div className="space-y-4 relative z-10">
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-white/30 italic">Notificacoes de Sistema</h3>
            <p className="text-xl font-bold leading-tight max-w-md">Voce possui <span className="text-blue-400">3 pendencias</span> fiscais aguardando sua revisao na agenda.</p>
         </div>
         <button 
           onClick={() => navigate('/app/company/agenda-fiscal')}
           className="relative z-10 bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-blue-900/40 transition-all hover:scale-105 flex items-center gap-4 group/btn"
         >
            Ver Agenda <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
         </button>
      </div>
    </div>
  );
}
