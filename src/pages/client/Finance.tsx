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
  ChevronRight
} from 'lucide-react';

const TRANSACTIONS = [
  { id: 1, description: 'Mensalidade Adworks - Plano Pro', amount: -397.00, status: 'PAID', date: '2026-02-10', category: 'Assinatura' },
  { id: 2, description: 'Guia DAS - Simples Nacional (Jan)', amount: -152.40, status: 'PENDING', date: '2026-02-20', category: 'Impostos' },
  { id: 3, description: 'Venda Consultoria Digital', amount: 2500.00, status: 'PAID', date: '2026-02-05', category: 'Vendas' },
  { id: 4, description: 'Compra de Domínio (.com.br)', amount: -40.00, status: 'PAID', date: '2026-02-01', category: 'Tecnologia' },
];

const FISCAL_CALENDAR = [
  { id: 'das', label: 'DAS - Simples Nacional', dueDate: '2026-02-20', status: 'PENDING', amount: 'R$ 152,40' },
  { id: 'inss', label: 'INSS / Pro-labore', dueDate: '2026-02-15', status: 'OVERDUE', amount: 'R$ 242,00' },
  { id: 'iss', label: 'ISS Mensal', dueDate: '2026-02-25', status: 'WAITING', amount: 'Calculando...' },
  { id: 'cert', label: 'Certificado Digital', dueDate: '2027-02-12', status: 'PAID', amount: '-' },
];

export function Finance() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'fiscal'>('overview');

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

  const getFiscalStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'OVERDUE': return <AlertCircle className="w-5 h-5 text-red-500 animate-bounce" />;
      case 'PENDING': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <Clock className="w-5 h-5 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Financeiro & Fiscal
          </h1>
          <p className="text-gray-500 font-medium">Gestão de caixa e obrigações da sua empresa.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button 
             onClick={() => setActiveTab('overview')}
             className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'bg-adworks-dark text-white shadow-lg' : 'text-gray-400 hover:text-adworks-dark'}`}
           >
             Caixa
           </button>
           <button 
             onClick={() => setActiveTab('fiscal')}
             className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'fiscal' ? 'bg-adworks-blue text-white shadow-lg' : 'text-gray-400 hover:text-adworks-blue'}`}
           >
             Calendário Fiscal
           </button>
        </div>
      </div>

      {activeTab === 'overview' ? (
        <>
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
              <div className="bg-adworks-blue p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-all"></div>
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
        </>
      ) : (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* CALENDÁRIO FISCAL (Inspiração ZeroPaper/Granatum) */}
          <div className="bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
             <div className="flex items-center justify-between mb-10">
                <div>
                   <h2 className="text-2xl font-black text-adworks-dark uppercase italic tracking-tight">Agenda de Obrigações</h2>
                   <p className="text-gray-400 text-sm font-medium">Mantenha sua empresa em dia com o fisco.</p>
                </div>
                <div className="flex items-center gap-2 text-adworks-blue font-black text-xs uppercase tracking-widest">
                   FEVEREIRO 2026
                   <CalendarIcon className="w-5 h-5" />
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {FISCAL_CALENDAR.map((item) => (
                  <div key={item.id} className={`p-6 rounded-[2rem] border-2 transition-all group cursor-pointer ${
                    item.status === 'OVERDUE' ? 'bg-red-50 border-red-100 hover:border-red-200' :
                    item.status === 'PAID' ? 'bg-green-50 border-green-100 hover:border-green-200' :
                    'bg-adworks-gray/50 border-transparent hover:border-adworks-blue/20'
                  }`}>
                    <div className="flex items-center justify-between mb-4">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm transition-transform group-hover:scale-110`}>
                          {getFiscalStatusIcon(item.status)}
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-tighter ${
                         item.status === 'OVERDUE' ? 'text-red-500' :
                         item.status === 'PAID' ? 'text-green-600' : 'text-gray-400'
                       }`}>
                         {new Date(item.dueDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                       </span>
                    </div>
                    <h4 className="font-bold text-adworks-dark text-sm mb-1">{item.label}</h4>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{item.amount}</p>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100">
                <h3 className="text-xl font-black text-adworks-dark uppercase italic mb-8">Arquivos & Guias (PDF)</h3>
                <div className="space-y-3">
                   {[
                     { name: 'Guia DAS - Período 01/2026', type: 'DAS', date: '10/02/2026' },
                     { name: 'Extrato Simples Nacional', type: 'DOC', date: '05/02/2026' },
                     { name: 'Comprovante de Rendimentos', type: 'FISCAL', date: '01/02/2026' }
                   ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-adworks-gray/30 rounded-3xl hover:bg-adworks-gray/50 transition-all group">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-adworks-blue shadow-sm">
                             <FileText className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-adworks-dark text-sm">{file.name}</h4>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Publicado em {file.date}</p>
                          </div>
                       </div>
                       <button className="w-10 h-10 bg-white text-gray-400 rounded-xl flex items-center justify-center hover:text-adworks-blue hover:shadow-md transition-all">
                          <Download className="w-5 h-5" />
                       </button>
                    </div>
                   ))}
                </div>
             </div>

             <div className="bg-adworks-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/20 transition-all"></div>
                <h3 className="text-xl font-black mb-6 uppercase italic tracking-tighter">Resumo de Impostos</h3>
                <div className="space-y-6">
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Pago (2026)</p>
                      <p className="text-3xl font-black tracking-tighter italic">R$ 1.152,40</p>
                   </div>
                   <div className="pt-6 border-t border-white/5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Economia Acumulada</p>
                      <p className="text-2xl font-black tracking-tighter text-adworks-accent italic">R$ 480,00</p>
                   </div>
                   <button className="w-full mt-6 flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all group">
                      <span className="text-xs font-black uppercase tracking-widest">Ver Histórico</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
