import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CreditCard, History, AlertCircle, Zap, ArrowUpRight } from 'lucide-react';

/**
 * 💸 PAYMENTS PAGE (Enterprise Utility)
 * Gestão de faturas, status do tenant e links de pagamento.
 * Sem usar a palavra "Billing" na UI.
 */

export function Payments() {
  const status = 'trial'; // Mock for UI

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. STATUS HEADER */}
      <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-8">
           <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center shadow-xl ${status === 'trial' ? 'bg-amber-50 text-amber-500 shadow-amber-100' : 'bg-emerald-50 text-emerald-500 shadow-emerald-100'}`}>
              <Zap className="w-10 h-10" />
           </div>
           <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">Status do Sistema</p>
              <div className="flex items-center gap-4">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase italic">Periodo de Teste</h2>
                 <Badge variant="warning" className="px-4 py-1 text-[10px] font-black uppercase tracking-widest">EXPIRA EM 12 DIAS</Badge>
              </div>
           </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 px-10 py-7 h-auto text-xs font-black uppercase tracking-[0.3em] gap-4 rounded-3xl transition-all hover:scale-105 active:scale-95 group">
           Ativar Conta <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 2. HISTORY OF PAYMENTS (8/12) */}
        <div className="lg:col-span-8 space-y-6">
           <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                 <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-[0.3em] italic leading-none">Historico de Pagamentos</h3>
                 <History className="w-4 h-4 text-slate-300" />
              </div>
              <div className="divide-y divide-slate-50">
                 {[
                   { id: 'INV-001', date: '19 FEV, 2026', amount: 'R$ 497,00', status: 'PAID' },
                   { id: 'INV-002', date: '19 JAN, 2026', amount: 'R$ 497,00', status: 'PAID' },
                 ].map((inv) => (
                   <div key={inv.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all group">
                      <div className="flex items-center gap-6">
                         <div className="p-3 bg-slate-100 text-slate-400 rounded-2xl group-hover:bg-blue-50 group-hover:text-blue-600 transition-all"><CreditCard className="w-6 h-6" /></div>
                         <div>
                            <p className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{inv.id}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{inv.date}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-10">
                         <span className="text-sm font-black text-slate-900 uppercase italic">{inv.amount}</span>
                         <Badge variant="success" className="font-black text-[9px] px-3 py-1">PAGO</Badge>
                         <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Recibo</button>
                      </div>
                   </div>
                 ))}
                 <div className="p-16 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Nenhuma fatura pendente</p>
                 </div>
              </div>
           </Card>
        </div>

        {/* 3. INFO & METHODS (4/12) */}
        <div className="lg:col-span-4 space-y-8">
           <Card className="bg-slate-900 text-white border-none shadow-2xl p-10 rounded-[2.5rem] relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-110 transition-all" />
              <div className="relative z-10">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 text-white/30 italic">Metodo Padrao</h3>
                 <div className="flex items-center gap-6 mb-12">
                    <div className="w-14 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 shadow-inner">
                       <span className="text-[9px] font-black text-white/50 uppercase tracking-widest">VISA</span>
                    </div>
                    <div>
                       <p className="text-base font-bold tracking-[0.1em]">•••• •••• •••• 4421</p>
                       <p className="text-[10px] text-white/20 font-black uppercase mt-1.5 tracking-widest">Expira em 10/28</p>
                    </div>
                 </div>
                 <Button variant="secondary" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 py-5 h-auto text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl">
                    Alterar Cartao
                 </Button>
              </div>
           </Card>

           <div className="p-10 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 space-y-6">
              <div className="flex items-center gap-3 text-blue-600">
                 <AlertCircle className="w-5 h-5" />
                 <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">Seguranca</span>
              </div>
              <p className="text-xs text-blue-900/60 font-bold leading-relaxed uppercase italic text-center">
                 Pagamentos processados via infraestrutura criptografada S2S.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
