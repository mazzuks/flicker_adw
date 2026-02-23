import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { 
  ClipboardList, 
  Search, 
  User, 
  ChevronRight, 
  MessageSquare, 
  FileText,
  AlertTriangle,
  History
} from 'lucide-react';

/**
 * 🎧 FISCAL WORK QUEUE - OPERATOR VIEW
 * Central management for tax calculation, NF review, and documents.
 */

export function FiscalOperatorQueue() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const { data } = await supabase
      .from('fiscal_tickets')
      .select('*, accounts(name)')
      .order('created_at', { ascending: false });
    setTickets(data || []);
    setLoading(false);
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent': return 'text-red-500 bg-red-50 border-red-100';
      case 'high': return 'text-amber-500 bg-amber-50 border-amber-100';
      default: return 'text-slate-400 bg-slate-50 border-slate-100';
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic">CARREGANDO FILA FISCAL...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">Fila Fiscal</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Gestao operacional e apuracao de impostos</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Chamados Abertos</span>
              <span className="text-2xl font-black text-blue-600 leading-none mt-1">{tickets.length}</span>
           </div>
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <ClipboardList className="w-6 h-6 text-white" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
         <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
               <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-900">Demandas Pendentes</h3>
               <div className="flex items-center gap-3">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                     <input placeholder="Filtrar fila..." className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-blue-600 w-48 transition-all" />
                  </div>
               </div>
            </div>

            <div className="divide-y divide-slate-50">
               {tickets.map((ticket) => (
                  <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className={`w-12 h-12 rounded-2xl border flex flex-col items-center justify-center shrink-0 ${getPriorityColor(ticket.priority)}`}>
                           {ticket.priority === 'urgent' && <AlertTriangle className="w-4 h-4 animate-pulse" />}
                           <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">{ticket.priority}</span>
                        </div>
                        <div>
                           <div className="flex items-center gap-3">
                              <p className="text-sm font-black text-slate-800 uppercase tracking-tight italic">{ticket.accounts?.name}</p>
                              <Badge variant="info" className="text-[8px] px-1.5 py-0 uppercase">
                                 {ticket.type.replace('_', ' ')}
                              </Badge>
                           </div>
                           <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aberto em: {new Date(ticket.created_at).toLocaleDateString('pt-BR')}</span>
                              <div className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Status: {ticket.status.replace('_', ' ')}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        <button className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all" title="Mensagens">
                           <MessageSquare className="w-4 h-4" />
                        </button>
                        <Button className="bg-slate-900 hover:bg-blue-600 text-white font-black uppercase text-[10px] px-6 py-3 h-auto rounded-xl shadow-lg transition-all flex items-center gap-3">
                           Assumir Chamado <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                     </div>
                  </div>
               ))}
               
               {tickets.length === 0 && (
                  <div className="p-24 text-center space-y-4">
                     <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto border border-slate-100 shadow-inner">
                        <History className="w-8 h-8 text-slate-200" />
                     </div>
                     <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] italic">Fila limpa. Nenhuma demanda operacional pendente.</p>
                  </div>
               )}
            </div>
         </Card>
      </div>
    </div>
  );
}
