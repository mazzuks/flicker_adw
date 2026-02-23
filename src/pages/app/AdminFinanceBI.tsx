import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
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
  PieChart,
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

/**
 * 🛡️ PRODUCT FINANCE BI - ADMIN VIEW (MVP 2.0)
 * Business intelligence with real-time metrics and growth charts.
 */

export function AdminFinanceBI() {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [stats, setStats] = useState<any>(null);
  const [accountsList, setAccountsList] = useState<any[]>([]);
  const [searchAccountId, setSearchAccountId] = useState('');

  // Mock data for the chart (would be a view in production)
  const chartData = [
    { name: 'Jan', mrr: 4200, churn: 2 },
    { name: 'Fev', mrr: 5100, churn: 1 },
    { name: 'Mar', mrr: 6800, churn: 4 },
    { name: 'Abr', mrr: 8500, churn: 2 },
    { name: 'Mai', mrr: 12400, churn: 3 },
  ];

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
        .select('*, subscriptions(status, plan_name, price_monthly)');

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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic leading-none">
              Gestao Estrategica Adworks
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
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
        <BiKpi label="Receita Acumulada" value={formatBRL(stats?.accumulated)} icon={DollarSign} color="text-indigo-500" bg="bg-indigo-50" />
        <BiKpi label="Receita do Mes" value={formatBRL(stats?.monthly)} icon={TrendingUp} color="text-emerald-500" bg="bg-emerald-50" />
        <BiKpi label="Ticket Medio" value={formatBRL(stats?.ticket)} icon={ArrowUpRight} color="text-blue-500" bg="bg-blue-50" />
        <BiKpi label="Churn Rate" value={`${Number(stats?.churn || 0).toFixed(1)}%`} icon={UserMinus} color="text-red-500" bg="bg-red-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* GROWTH CHART (8/12) */}
        <div className="lg:col-span-8">
           <Card className="p-8 border border-slate-200 shadow-sm rounded-[2.5rem]">
              <div className="flex items-center justify-between mb-10">
                 <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.3em] italic flex items-center gap-3">
                    <PieChart className="w-4 h-4 text-blue-600" /> Tendencia de Crescimento (MRR)
                 </h3>
                 <Badge variant="success" className="text-[8px]">+12.4% este mes</Badge>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorMrr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fontSize: 10, fontWeight: 700, fill: '#94A3B8'}} 
                      dy={10}
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                      itemStyle={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', color: '#0F172A' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="mrr" 
                      stroke="#2563eb" 
                      strokeWidth={4} 
                      fillOpacity={1} 
                      fill="url(#colorMrr)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </Card>
        </div>

        {/* ACCOUNTS LIST (4/12) */}
        <div className="lg:col-span-4">
           <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden h-[465px] flex flex-col">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
                 <h3 className="font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] italic">Unidades de Negocio</h3>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                 {accountsList.map((acc) => (
                    <div key={acc.id} className="p-5 flex items-center justify-between hover:bg-slate-50 transition-all cursor-pointer">
                       <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0"><Building2 className="w-4 h-4" /></div>
                          <div className="min-w-0">
                             <p className="text-xs font-black text-slate-800 uppercase italic truncate">{acc.name}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">{acc.subscriptions?.[0]?.plan_name || acc.plan}</p>
                          </div>
                       </div>
                       <ChevronRight className="w-4 h-4 text-slate-200" />
                    </div>
                 ))}
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}

function BiKpi({ label, value, icon: Icon, color, bg }: any) {
   return (
      <Card className="p-8 border border-slate-200 shadow-sm rounded-[2.5rem] space-y-4 hover:shadow-xl transition-all group">
         <div className="flex items-center gap-3">
            <div className={`p-2 rounded-2xl ${bg} ${color} transition-all group-hover:scale-110 shadow-sm`}>
               <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">{label}</span>
         </div>
         <div className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">{value}</div>
      </Card>
   );
}
