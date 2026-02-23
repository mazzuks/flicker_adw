import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle, 
  Wallet
} from 'lucide-react';

/**
 * 💰 COMPANY FINANCE DASHBOARD - CLIENT VIEW
 * Displays core financial metrics for the current month.
 */

export function CompanyFinance() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.account_id) loadMetrics();
  }, [profile?.account_id]);

  const loadMetrics = async () => {
    const now = new Date();
    const monthRef = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    const { data } = await supabase
      .from('company_finance_metrics')
      .select('*')
      .eq('month_ref', monthRef)
      .maybeSingle();
    
    setMetrics(data);
    setLoading(false);
  };

  const formatBRL = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">Carregando Financas...</div>;

  const currentMonthName = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Gestao Financeira</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Referencia: <span className="text-blue-600">{currentMonthName}</span></p>
        </div>
        <div className="flex items-center gap-3">
           <Badge variant="neutral" className="bg-slate-100 text-slate-500 border-none font-black text-[10px] px-4 py-1 uppercase">Dados Manuais</Badge>
        </div>
      </div>

      {!metrics && (
         <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            <p className="text-xs font-bold text-blue-900 uppercase tracking-tight italic">
               Aguardando atualizacao do seu operador contabil para os dados deste mes.
            </p>
         </div>
      )}

      {/* KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <FinanceKpi 
           label="Faturamento Mes" 
           value={formatBRL(metrics?.revenue_month)} 
           icon={TrendingUp} 
           color="text-emerald-500" 
           bg="bg-emerald-50"
        />
        <FinanceKpi 
           label="Faturamento Acumulado" 
           value={formatBRL(metrics?.revenue_accum)} 
           icon={BarChart3} 
           color="text-blue-500" 
           bg="bg-blue-50"
        />
        <FinanceKpi 
           label="Impostos Pagos" 
           value={formatBRL(metrics?.taxes_paid)} 
           icon={CheckCircle2} 
           color="text-emerald-600" 
           bg="bg-emerald-50"
        />
        <FinanceKpi 
           label="Impostos em Aberto" 
           value={formatBRL(metrics?.taxes_open)} 
           icon={AlertCircle} 
           color="text-red-500" 
           bg="bg-red-50"
        />
      </div>

      {/* EXTRA INFO */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="p-8 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] flex flex-col justify-center gap-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Conciliacao Bancaria</h3>
            <p className="text-lg font-bold text-slate-700 leading-tight">Integracao com APIs bancarias para extratos automaticos prevista para o proximo quarter.</p>
            <button className="w-fit text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Saber mais</button>
         </Card>

         <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white flex flex-col justify-center gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-all" />
            <div className="relative z-10 space-y-4">
               <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-black uppercase tracking-widest italic opacity-50">Dica Financeira</h3>
               </div>
               <p className="text-base font-medium text-slate-300 leading-relaxed">
                  Lembre-se de separar suas despesas pessoais da conta PJ para manter sua contabilidade em conformidade.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}

function FinanceKpi({ label, value, icon: Icon, color, bg }: { label: string, value: string, icon: any, color: string, bg: string }) {
   return (
      <Card className="p-8 border border-slate-200 shadow-sm rounded-[2rem] space-y-4 hover:shadow-lg transition-all">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${bg} ${color}`}>
               <Icon className="w-4 h-4" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{label}</span>
         </div>
         <div className="text-2xl font-black text-slate-900 tracking-tight italic">{value}</div>
      </Card>
   );
}
