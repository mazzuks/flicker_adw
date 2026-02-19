import React from 'react';
import { Card, KpiCard } from '../../components/ui/DashboardUI';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CreditCard, History, AlertCircle, CheckCircle2, Zap, ArrowUpRight } from 'lucide-react';

/**
 * 💸 PAYMENTS PAGE (Enterprise Utility)
 * Gestão de faturas, status do tenant e links de pagamento.
 * Sem usar a palavra "Billing" na UI.
 */

export function Payments() {
  const status = 'trial'; // Mock for UI

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 1. STATUS HEADER */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${status === 'trial' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}
          >
            <Zap className="w-8 h-8" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
              Status do Sistema
            </p>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Período de Teste (Trial)
              </h2>
              <Badge variant="warning">EXPIRA EM 12 DIAS</Badge>
            </div>
          </div>
        </div>
        <Button
          variant="primary"
          className="bg-blue-600 shadow-xl shadow-blue-200 px-8 py-6 h-auto text-sm font-bold uppercase tracking-widest gap-3"
        >
          Ativar Conta Agora <ArrowUpRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 2. HISTORY OF PAYMENTS (8/12) */}
        <div className="lg:col-span-8 space-y-6">
          <Card noPadding className="border border-slate-200 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">
                Histórico de Pagamentos
              </h3>
              <History className="w-4 h-4 text-slate-300" />
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { id: 'INV-001', date: '19 Fev, 2026', amount: 'R$ 497,00', status: 'PAID' },
                { id: 'INV-002', date: '19 Jan, 2026', amount: 'R$ 497,00', status: 'PAID' },
              ].map((inv) => (
                <div
                  key={inv.id}
                  className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 text-slate-400 rounded-lg">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{inv.id}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {inv.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className="text-sm font-bold text-slate-900">{inv.amount}</span>
                    <Badge variant="success">PAGO</Badge>
                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                      Recibo
                    </button>
                  </div>
                </div>
              ))}
              <div className="p-10 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                  Nenhuma fatura pendente
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* 3. INFO & METHODS (4/12) */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="bg-slate-900 text-white border-none shadow-2xl">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-6 text-white/40 italic">
              Método Padrão
            </h3>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center border border-white/10">
                <span className="text-[8px] font-bold text-white/60 uppercase">VISA</span>
              </div>
              <div>
                <p className="text-sm font-bold">•••• •••• •••• 4421</p>
                <p className="text-[10px] text-white/40 font-bold uppercase">Expira em 10/28</p>
              </div>
            </div>
            <Button
              variant="secondary"
              className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
            >
              Alterar Cartão
            </Button>
          </Card>

          <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Dica de Segurança
              </span>
            </div>
            <p className="text-xs text-blue-900 font-medium leading-relaxed">
              Todos os nossos pagamentos são processados via infraestrutura criptografada
              (PagBank/Mercado Pago). Não armazenamos seus dados sensíveis.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
