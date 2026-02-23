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
  Calendar,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/**
 * 💰 COMPANY FINANCE DASHBOARD (MVP 2.0)
 * Displays core financial metrics with period selection and history.
 */

export function CompanyFinance() {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (profile?.account_id) {
      loadFinanceData();
    }
  }, [profile?.account_id, selectedDate]);

  const loadFinanceData = async () => {
    setLoading(true);
    try {
      const monthRef = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-01`;

      // 1. Fetch metrics for selected month
      const { data: currentMetrics } = await supabase
        .from('company_finance_metrics')
        .select('*')
        .eq('account_id', profile?.account_id as string)
        .eq('month_ref', monthRef)
        .maybeSingle();

      // 2. Fetch history (last 12 months)
      const { data: historyData } = await supabase
        .from('company_finance_metrics')
        .select('*')
        .eq('account_id', profile?.account_id as string)
        .order('month_ref', { ascending: false })
        .limit(12);

      setMetrics(currentMetrics);
      setHistory(historyData || []);
    } catch (err) {
      console.error('Error loading finance data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatBRL = (val: number) => {
    return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
  };

  const currentMonthDisplay = selectedDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  if (loading && !metrics)
    return (
      <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">
        Sincronizando Financas...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER & PERIOD SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">
            Gestao Financeira
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-2 italic">
            Monitoramento de Performance e Impostos
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          <button
            onClick={() => changeMonth(-1)}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-4">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-700 min-w-[140px] text-center">
              {currentMonthDisplay}
            </span>
          </div>
          <button
            onClick={() => changeMonth(1)}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-blue-600 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!metrics && !loading && (
        <div className="bg-amber-50 border border-amber-100 p-6 rounded-[2rem] flex items-center gap-4 animate-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <p className="text-xs font-bold text-amber-900 uppercase tracking-tight italic">
            Nenhum dado encontrado para este periodo. Aguardando lancamento do operador.
          </p>
        </div>
      )}

      {/* KPI GRID */}
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

      {/* HISTORY TABLE */}
      <div className="space-y-6">
        <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] italic ml-2">
          Historico de Lancamentos
        </h3>
        <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Periodo
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Faturamento
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Impostos Pagos
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Impostos Abertos
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold text-slate-700 uppercase italic">
                      {new Date(h.month_ref + 'T00:00:00').toLocaleDateString('pt-BR', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-slate-900">
                    {formatBRL(h.revenue_month)}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-emerald-600">
                    {formatBRL(h.taxes_paid)}
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-red-500">
                    {formatBRL(h.taxes_open)}
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex justify-center">
                      {h.taxes_open === 0 ? (
                        <Badge variant="success" className="text-[8px] font-black">
                          REGULAR
                        </Badge>
                      ) : (
                        <Badge variant="danger" className="text-[8px] font-black">
                          PENDENTE
                        </Badge>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">
                      Nenhum registro historico encontrado
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* FOOTER TIP */}
      <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-all" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <Wallet className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest italic opacity-50">
              Dica Adworks
            </h3>
            <p className="text-base font-medium text-slate-300 leading-tight">
              Mantenha seus lancamentos atualizados para gerar relatorios precisos.
            </p>
          </div>
        </div>
        <button className="relative z-10 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20">
          Ver Relatorio Anual
        </button>
      </div>
    </div>
  );
}

function FinanceKpi({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <Card className="p-8 border border-slate-200 shadow-sm rounded-[2rem] space-y-4 hover:shadow-lg transition-all group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bg} ${color} transition-all group-hover:scale-110 shadow-sm`}>
          <Icon className="w-4 h-4" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          {label}
        </span>
      </div>
      <div className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
        {value}
      </div>
    </Card>
  );
}
