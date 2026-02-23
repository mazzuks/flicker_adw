import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import {
  TrendingUp,
  UserMinus,
  DollarSign,
  ArrowUpRight,
  Activity,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2,
} from 'lucide-react';

/**
 * 🛡️ PRODUCT FINANCE BI - ADMIN VIEW (MVP)
 * High-level business metrics and account-level performance tracking.
 */

export function AdminFinanceBI() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState<any>(null);
  const [accountsList, setAccountsList] = useState<any[]>([]);
  const [searchAccountId, setSearchAccountId] = useState('');

  useEffect(() => {
    loadBIData();
  }, [selectedDate, searchAccountId]);

  const loadBIData = async () => {
    setLoading(true);
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const monthStr = String(month).padStart(2, '0');
      const startOfMonth = `${year}-${monthStr}-01`;
      const endOfMonth = new Date(year, month, 0).toISOString().split('T')[0];

      // 1. Fetch Subscriptions for KPIs
      let query = supabase.from('subscriptions').select('*');
      if (searchAccountId) query = query.eq('account_id', searchAccountId);

      const { data: allSubs } = await query;
      const activeSubs = allSubs?.filter((s) => s.status === 'active') || [];
      const canceledThisMonth = allSubs?.filter((s) => 
        s.status === 'canceled' && 
        s.canceled_at && 
        s.canceled_at >= startOfMonth && 
        s.canceled_at <= endOfMonth
      ) || [];

      const monthlyRevenue = activeSubs.reduce((acc, s) => acc + Number(s.price_monthly), 0);
      const accumRevenue = allSubs?.reduce((acc, s) => acc + Number(s.price_monthly), 0) || 0;
      const ticketAvg = activeSubs.length > 0 ? monthlyRevenue / activeSubs.length : 0;
      const churnRate = activeSubs.length > 0 ? (canceledThisMonth.length / (activeSubs.length + canceledThisMonth.length)) * 100 : 0;

      setStats({
        accumulated: accumRevenue,
        monthly: monthlyRevenue,
        ticket: ticketAvg,
        churn: churnRate,
      });

      // 2. Fetch Accounts with Details
      const { data: accountsData } = await supabase
        .from('accounts')
        .select('id, name, plan, created_at, subscriptions(status, plan_name, price_monthly)');

      setAccountsList(accountsData || []);
    } catch (err) {
      console.error('Error loading BI:', err);
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

  if (loading && !stats)
    return (
      <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">
        Sincronizando Business Intelligence...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-slate-900 text-white rounded-3xl shadow-xl">
            <Activity className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Business Intelligence
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">
              Dashboard de Saude do Produto
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* PERIOD SELECTOR */}
          <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
            >
              <ChevronLeft className="w-4 h-4 text-slate-400" />
            </button>
            <div className="flex items-center gap-2 px-3">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">
                {selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </span>
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all"
            >
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Account ID..."
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:ring-2 focus:ring-blue-500 w-40 transition-all"
              value={searchAccountId}
              onChange={(e) => setSearchAccountId(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <BiKpi
          label="Receita Acumulada"
          value={formatBRL(stats?.accumulated)}
          icon={DollarSign}
          color="text-indigo-500"
          bg="bg-indigo-50"
        />
        <BiKpi
          label="Receita do Mes (MRR)"
          value={formatBRL(stats?.monthly)}
          icon={TrendingUp}
          color="text-emerald-500"
          bg="bg-emerald-50"
        />
        <BiKpi
          label="Ticket Medio"
          value={formatBRL(stats?.ticket)}
          icon={ArrowUpRight}
          color="text-blue-500"
          bg="bg-blue-50"
        />
        <BiKpi
          label="Churn Rate (Mes)"
          value={`${Number(stats?.churn || 0).toFixed(1)}%`}
          icon={UserMinus}
          color="text-red-500"
          bg="bg-red-50"
        />
      </div>

      {/* ACCOUNTS LIST */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] italic ml-2">
          Performance por Unidade de Negocio
        </h3>
        <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Empresa
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Plano
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Status
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Receita/Mes
                </th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Acoes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {accountsList.map((acc) => {
                const sub = acc.subscriptions?.[0];
                return (
                  <tr key={acc.id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">
                            {acc.name}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                            ID: {acc.id.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                        {sub?.plan_name || acc.plan || 'TRIAL'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            sub?.status === 'active' || acc.plan === 'active'
                              ? 'success'
                              : 'neutral'
                          }
                          className="text-[8px] font-black"
                        >
                          {sub?.status?.toUpperCase() || acc.plan?.toUpperCase() || 'OFFLINE'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="text-sm font-black text-slate-900 uppercase italic">
                        {formatBRL(sub?.price_monthly || 0)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex justify-center">
                        <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

function BiKpi({
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
    <Card className="p-8 border border-slate-200 shadow-sm rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all group">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl ${bg} ${color} transition-all group-hover:scale-110 shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
          {label}
        </span>
      </div>
      <div className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">
        {value}
      </div>
    </Card>
  );
}
