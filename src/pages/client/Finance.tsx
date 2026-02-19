import { useState } from 'react';
import {
  DollarSign,
  Calendar as CalendarIcon,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download,
  Filter,
  Plus,
  FileText,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  LayoutGrid,
  List,
  CheckCircle,
  CreditCard,
} from 'lucide-react';

const TRANSACTIONS = [
  {
    id: 1,
    description: 'Mensalidade Adworks - Plano Pro',
    amount: -397.0,
    status: 'PAID',
    date: '2026-02-10',
    category: 'Impostos',
    type: 'Credit Card',
  },
  {
    id: 2,
    description: 'Guia DAS - Simples Nacional (Jan)',
    amount: -152.4,
    status: 'PENDING',
    date: '2026-02-20',
    category: 'Impostos',
    type: 'PIX',
  },
  {
    id: 3,
    description: 'Venda Consultoria Digital',
    amount: 2500.0,
    status: 'PAID',
    date: '2026-02-05',
    category: 'Vendas',
    type: 'TED',
  },
  {
    id: 4,
    description: 'Compra de Domínio (.com.br)',
    amount: -40.0,
    status: 'PAID',
    date: '2026-02-01',
    category: 'Tecnologia',
    type: 'PIX',
  },
  {
    id: 5,
    description: 'Fatura AWS - Servidores',
    amount: -125.5,
    status: 'PAID',
    date: '2026-02-08',
    category: 'Tecnologia',
    type: 'Visa',
  },
];

const FISCAL_CALENDAR = [
  {
    id: 'das',
    label: 'DAS - Simples Nacional',
    dueDate: '2026-02-20',
    status: 'PENDING',
    amount: 'R$ 152,40',
  },
  {
    id: 'inss',
    label: 'INSS / Pro-labore',
    dueDate: '2026-02-15',
    status: 'OVERDUE',
    amount: 'R$ 242,00',
  },
  {
    id: 'iss',
    label: 'ISS Mensal',
    dueDate: '2026-02-25',
    status: 'WAITING',
    amount: 'Calculando...',
  },
  { id: 'cert', label: 'Certificado Digital', dueDate: '2027-02-12', status: 'PAID', amount: '-' },
];

export function Finance() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'fiscal' | 'analytics'>(
    'transactions'
  );
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  const categories = [
    'Todos',
    'Recebimentos',
    'Despesas fixas',
    'Impostos',
    'Vendas',
    'Tecnologia',
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* 🏁 TOP NAV & TITLES */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
              Beta Financial
            </span>
            <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic leading-none">
              Transações
            </h1>
          </div>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">
            Resultado previsto no mês:{' '}
            <span className="text-green-600 font-black">R$ 1.910,60</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white p-2 rounded-[1.5rem] shadow-adw-soft border border-gray-100">
          {['transactions', 'fiscal', 'analytics'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === t
                  ? 'bg-adworks-blue text-white shadow-xl'
                  : 'text-gray-400 hover:text-adworks-dark'
              }`}
            >
              {t === 'transactions' ? 'Lançamentos' : t === 'fiscal' ? 'Calendário' : 'Análise'}
            </button>
          ))}
        </div>
      </div>

      {/* 📊 SUMMARY BARS (Procfy Style) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-10">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-adworks-blue uppercase tracking-[0.2em]">
                    Recebimentos
                  </p>
                  <span className="text-green-600 font-black text-xs">100,00%</span>
                </div>
                <div className="h-2 w-full bg-adworks-gray rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-green-500 h-full shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                    style={{ width: '100%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-400">RECEBIDO</span>
                  <span className="text-adworks-dark font-black tracking-tight">R$ 58.074,49</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em]">
                    Despesas
                  </p>
                  <span className="text-red-500 font-black text-xs">80,30%</span>
                </div>
                <div className="h-2 w-full bg-adworks-gray rounded-full overflow-hidden mb-4">
                  <div
                    className="bg-red-500 h-full shadow-[0_0_10px_rgba(239,68,68,0.4)]"
                    style={{ width: '80.3%' }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-gray-400">PAGO</span>
                  <span className="text-adworks-dark font-black tracking-tight">R$ 32.441,75</span>
                </div>
              </div>
            </div>

            {/* CATEGORY FILTER PILLS */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                    categoryFilter === cat
                      ? 'bg-adworks-dark text-white border-adworks-dark'
                      : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* TRANSACTION TABLE (Dense Procfy Style) */}
          <div className="bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center justify-between">
              <div className="flex gap-4">
                <button className="bg-adworks-gray p-2.5 rounded-xl text-gray-400 hover:text-adworks-blue transition-all">
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button className="bg-adworks-blue/10 p-2.5 rounded-xl text-adworks-blue shadow-sm">
                  <List className="w-4 h-4" />
                </button>
              </div>
              <button className="text-adworks-blue font-black text-[10px] uppercase tracking-widest border-2 border-adworks-blue/20 px-6 py-3 rounded-2xl hover:bg-adworks-blue hover:text-white transition-all">
                + Nova Transação
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-adworks-gray/50">
                  <tr>
                    <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Data
                    </th>
                    <th className="px-4 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Descrição
                    </th>
                    <th className="px-4 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                      Categoria
                    </th>
                    <th className="px-4 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">
                      Valor
                    </th>
                    <th className="px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-center">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {TRANSACTIONS.map((t) => (
                    <tr key={t.id} className="group hover:bg-adworks-gray/30 transition-all">
                      <td className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                        {new Date(t.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </td>
                      <td className="px-4 py-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black ${t.amount < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}
                          >
                            {t.type === 'PIX' ? 'PX' : 'CC'}
                          </div>
                          <h4 className="font-bold text-adworks-dark text-sm leading-tight italic">
                            {t.description}
                          </h4>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-[9px] font-black bg-adworks-gray text-gray-400 px-2.5 py-1 rounded-lg uppercase">
                          {t.category}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-5 text-right font-black tracking-tighter text-sm ${t.amount < 0 ? 'text-adworks-dark' : 'text-green-600'}`}
                      >
                        R$ {Math.abs(t.amount).toFixed(2)}
                      </td>
                      <td className="px-8 py-5 text-center">
                        <div
                          className={`w-10 h-6 rounded-full mx-auto p-1 flex items-center transition-all ${t.status === 'PAID' ? 'bg-green-500' : 'bg-gray-200'}`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${t.status === 'PAID' ? 'translate-x-4' : 'translate-x-0'}`}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SIDEBAR ANALYTICS (Granatum Style) */}
        <div className="space-y-8">
          <div className="bg-adworks-dark p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-48 h-48 bg-adworks-blue/20 rounded-full -mr-24 -mt-24 blur-3xl transition-all duration-1000 group-hover:bg-adworks-blue/40"></div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">
              Saldo Atual das Contas
            </p>
            <h3 className="text-4xl font-black italic tracking-tighter leading-none mb-10">
              R$ 81.371,85
            </h3>

            <div className="space-y-4">
              {[
                { name: 'Conta Principal (Cora)', amount: 'R$ 58.074,49', icon: Building2 },
                { name: 'Itaú Personalité', amount: 'R$ 23.297,36', icon: CreditCard },
                { name: 'Caixinha', amount: 'R$ 0,00', icon: Database },
              ].map((acc, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <acc.icon className="w-4 h-4 text-adworks-blue" />
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                      {acc.name}
                    </span>
                  </div>
                  <span className="text-xs font-black">{acc.amount}</span>
                </div>
              ))}
            </div>

            <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
              + Adicionar Conta
            </button>
          </div>

          <div className="bg-white p-10 rounded-[2.5rem] shadow-adw-soft border border-gray-100 group">
            <h3 className="text-sm font-black text-adworks-dark uppercase tracking-widest mb-8 italic">
              Receitas por Categoria
            </h3>
            <div className="space-y-6">
              {[
                {
                  cat: 'Vendas / Consultoria',
                  val: 'R$ 68.550',
                  perc: '67%',
                  color: 'bg-green-500',
                },
                { cat: 'Desenvolvimento', val: 'R$ 25.000', perc: '24%', color: 'bg-blue-500' },
                { cat: 'Criação de Sites', val: 'R$ 9.000', perc: '9%', color: 'bg-purple-500' },
              ].map((c, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase">
                    <span className="text-gray-400">{c.cat}</span>
                    <span className="text-adworks-dark">{c.val}</span>
                  </div>
                  <div className="h-1.5 w-full bg-adworks-gray rounded-full overflow-hidden">
                    <div
                      className={`${c.color} h-full group-hover:animate-pulse`}
                      style={{ width: c.perc }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Database(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}
