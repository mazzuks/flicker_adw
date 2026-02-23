import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { 
  TrendingUp, 
  UserMinus, 
  DollarSign, 
  ArrowUpRight,
  Activity
} from 'lucide-react';

/**
 * 🛡️ PRODUCT FINANCE BI - ADMIN VIEW
 * High-level business metrics: MRR, ARPU, Churn.
 */

export function AdminFinanceBI() {
  const [stats, setStats] = useState<any>(null);
  const [recentCancellations, setRecentCancellations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBI();
  }, []);

  const loadBI = async () => {
    setLoading(true);
    try {
      const { data: biData } = await supabase.from('v_product_finance_bi').select('*').single();
      setStats(biData);

      const { data: cancellations } = await supabase
        .from('subscriptions')
        .select('*, accounts(name)')
        .eq('status', 'canceled')
        .order('canceled_at', { ascending: false })
        .limit(5);
      
      setRecentCancellations(cancellations || []);
    } catch (err) {
      console.error('Error loading BI:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">Processando Metricas de Negocio...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Business Intelligence</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saude Financeira do Produto Adworks</p>
        </div>
        <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-xl">
           <Activity className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <BiKpi 
           label="Receita Acumulada (MRR)" 
           value={formatBRL(stats?.accumulated_revenue)} 
           icon={DollarSign} 
           color="text-blue-500" 
           bg="bg-blue-50"
        />
        <BiKpi 
           label="Receita Media (ARPU)" 
           value={formatBRL(stats?.avg_revenue_per_user)} 
           icon={TrendingUp} 
           color="text-emerald-500" 
           bg="bg-emerald-50"
        />
        <BiKpi 
           label="Ticket Medio" 
           value={formatBRL(stats?.ticket_average)} 
           icon={ArrowUpRight} 
           color="text-indigo-500" 
           bg="bg-indigo-50"
        />
        <BiKpi 
           label="Churn Rate (30d)" 
           value={`${Number(stats?.churn_rate_30d || 0).toFixed(1)}%`} 
           icon={UserMinus} 
           color="text-red-500" 
           bg="bg-red-50"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
           <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                 <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] italic">Ultimos Cancelamentos</h3>
                 <UserMinus className="w-4 h-4 text-slate-300" />
              </div>
              <div className="divide-y divide-slate-50">
                 {recentCancellations.map((sub) => (
                    <div key={sub.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                             {sub.accounts?.name?.charAt(0)}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{sub.accounts?.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Plano: {sub.plan_name}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">Cancelado em</p>
                          <p className="text-[11px] font-bold text-slate-900 mt-1">{new Date(sub.canceled_at).toLocaleDateString('pt-BR')}</p>
                       </div>
                    </div>
                 ))}
                 {recentCancellations.length === 0 && (
                    <div className="p-20 text-center">
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic text-center">Nenhum churn detectado no periodo</p>
                    </div>
                 )}
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
}

function BiKpi({ label, value, icon: Icon, color, bg }: { label: string, value: string, icon: any, color: string, bg: string }) {
   return (
      <Card className="p-8 border border-slate-200 shadow-sm rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-2xl ${bg} ${color} shadow-sm`}>
               <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{label}</span>
         </div>
         <div className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{value}</div>
      </Card>
   );
}
