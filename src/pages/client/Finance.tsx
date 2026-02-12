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
  Plus
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, description: 'Mensalidade Adworks - Plano Pro', amount: -397.00, status: 'PAID', date: '2026-02-10', category: 'Assinatura' },
  { id: 2, description: 'Guia DAS - Simples Nacional (Jan)', amount: -152.40, status: 'PENDING', date: '2026-02-20', category: 'Impostos' },
  { id: 3, description: 'Venda Consultoria Digital', amount: 2500.00, status: 'PAID', date: '2026-02-05', category: 'Vendas' },
  { id: 4, description: 'Compra de Domínio (.com.br)', amount: -40.00, status: 'PAID', date: '2026-02-01', category: 'Tecnologia' },
];

export function Finance() {
  const [loading, setLoading] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <span className="flex items-center text-[10px] font-black uppercase text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">Pago</span>;
      case 'PENDING':
        return <span className="flex items-center text-[10px] font-black uppercase text-orange-600 bg-orange-50 px-2 py-1 rounded-full border border-orange-100 animate-pulse">Aguardando</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Financeiro
          </h1>
          <p className="text-gray-500 font-medium">Gestão de caixa e impostos simplificada.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-gray-100 text-adworks-dark px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-gray-50 transition-all shadow-adw-soft flex items-center gap-2">
            <Download className="w-5 h-5" />
            <span>Relatórios</span>
          </button>
          <button className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-adworks-blue/20 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            <span>Nova Guia</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-adworks-dark p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/30 transition-all"></div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Saldo Projetado</p>
          <h3 className="text-4xl font-black tracking-tighter italic">R$ 1.910,60</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-green-400">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+R$ 150,00 vs ontem</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 text-adworks-blue">A Pagar (Mês)</p>
          <h3 className="text-4xl font-black tracking-tighter italic text-adworks-dark text-red-500">R$ 589,40</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-gray-400">
            <Clock className="w-4 h-4 mr-1" />
            <span>Próximo: DAS em 8 dias</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">A Receber</p>
          <h3 className="text-4xl font-black tracking-tighter italic text-adworks-dark">R$ 2.500,00</h3>
          <div className="mt-6 flex items-center text-xs font-bold text-green-500">
            <CheckCircle2 className="w-4 h-4 mr-1" />
            <span>3 faturas liquidadas</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-adw-soft border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black text-adworks-dark uppercase italic">Fluxo Recente</h2>
              <Filter className="w-5 h-5 text-gray-300 cursor-pointer hover:text-adworks-blue" />
            </div>

            <div className="space-y-4">
              {TRANSACTIONS.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-5 bg-adworks-gray/50 rounded-3xl border border-transparent hover:border-gray-100 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${t.amount < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      {t.amount < 0 ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-adworks-dark">{t.description}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{t.category} • {new Date(t.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-black ${t.amount < 0 ? 'text-adworks-dark' : 'text-green-600'}`}>
                      {t.amount < 0 ? '-' : '+'} R$ {Math.abs(t.amount).toFixed(2)}
                    </p>
                    <div className="mt-1 flex justify-end">
                      {getStatusBadge(t.status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-adworks-blue p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-200" />
              FISCAL
            </h3>
            <p className="text-blue-100 text-sm font-medium leading-relaxed mb-6 italic">
              "Sua guia do Simples Nacional (DAS) já está disponível. Vence em 20/02."
            </p>
            <button className="w-full bg-white text-adworks-blue py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95">
              PAGAR AGORA (PIX)
            </button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-adw-soft border border-gray-100">
            <h3 className="text-lg font-black text-adworks-dark mb-6 uppercase italic">Economia Adworks</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-2xl border border-green-100 flex items-center justify-between">
                 <p className="text-xs font-bold text-green-700">Taxas evitadas:</p>
                 <p className="text-sm font-black text-green-700">R$ 125,40</p>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed italic">
                Ao usar nosso emissor próprio, você economizou R$ 12,50 por nota emitida este mês.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
