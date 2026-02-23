import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ArrowLeft, 
  Save, 
  TrendingUp, 
  BarChart3, 
  CheckCircle2, 
  AlertCircle,
  Database
} from 'lucide-react';

/**
 * 🎧 OPERATOR FINANCE EDITOR
 * Allows operators to update financial metrics for a specific account.
 */

export function OperatorFinanceEditor() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [account, setAccount] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    revenue_month: 0,
    revenue_accum: 0,
    taxes_paid: 0,
    taxes_open: 0
  });

  useEffect(() => {
    if (accountId) loadData();
  }, [accountId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: acc } = await supabase.from('accounts').select('name').eq('id', accountId).single();
      setAccount(acc);

      const now = new Date();
      const monthRef = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: metrics } = await supabase
        .from('company_finance_metrics')
        .select('*')
        .eq('account_id', accountId)
        .eq('month_ref', monthRef)
        .maybeSingle();

      if (metrics) {
        setFormData({
          revenue_month: Number(metrics.revenue_month),
          revenue_accum: Number(metrics.revenue_accum),
          taxes_paid: Number(metrics.taxes_paid),
          taxes_open: Number(metrics.taxes_open)
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const now = new Date();
    const monthRef = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

    try {
      const { error } = await supabase.from('company_finance_metrics').upsert({
        account_id: accountId,
        month_ref: monthRef,
        ...formData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'account_id, month_ref' });

      if (error) throw error;
      alert('Metricas financeiras atualizadas!');
    } catch (err: any) {
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300">CARREGANDO DADOS...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
           <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
           <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Editor Financeiro</h1>
           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Conta: {account?.name}</p>
        </div>
      </div>

      <Card className="p-10 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
         <form onSubmit={handleSave} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                     <TrendingUp className="w-3 h-3" /> Faturamento do Mes
                  </label>
                  <input 
                     type="number" step="0.01" required
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                     value={formData.revenue_month}
                     onChange={e => setFormData({...formData, revenue_month: parseFloat(e.target.value)})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                     <BarChart3 className="w-3 h-3" /> Faturamento Acumulado
                  </label>
                  <input 
                     type="number" step="0.01" required
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                     value={formData.revenue_accum}
                     onChange={e => setFormData({...formData, revenue_accum: parseFloat(e.target.value)})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                     <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Impostos Pagos
                  </label>
                  <input 
                     type="number" step="0.01" required
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                     value={formData.taxes_paid}
                     onChange={e => setFormData({...formData, taxes_paid: parseFloat(e.target.value)})}
                  />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                     <AlertCircle className="w-3 h-3 text-red-500" /> Impostos em Aberto
                  </label>
                  <input 
                     type="number" step="0.01" required
                     className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                     value={formData.taxes_open}
                     onChange={e => setFormData({...formData, taxes_open: parseFloat(e.target.value)})}
                  />
               </div>
            </div>

            <Button type="submit" isLoading={saving} className="w-full bg-slate-900 hover:bg-blue-600 text-white py-6 h-auto rounded-2xl text-xs font-black uppercase tracking-[0.3em] shadow-xl transition-all flex items-center justify-center gap-3 group">
               <Save className="w-4 h-4 group-hover:scale-110 transition-all" /> Salvar Metricas do Mes
            </Button>
         </form>
      </Card>

      <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex items-start gap-4">
         <Database className="w-6 h-6 text-amber-500 shrink-0" />
         <div>
            <p className="text-xs font-bold text-amber-900 uppercase tracking-tight italic">Aviso de Integridade</p>
            <p className="text-xs text-amber-800/70 font-medium leading-relaxed mt-1 uppercase italic">
               Estes dados sao refletidos instantaneamente no painel do cliente. Certifique-se de validar os valores antes de salvar.
            </p>
         </div>
      </div>
    </div>
  );
}
