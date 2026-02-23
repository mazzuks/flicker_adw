import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  UserCheck 
} from 'lucide-react';

/**
 * 📅 FISCAL AGENDA - CLIENT VIEW
 * Displays upcoming taxes and documents for the current account.
 */

export function FiscalAgenda() {
  const { profile } = useAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.account_id) loadEvents();
  }, [profile?.account_id]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('fiscal_events')
      .select('*')
      .order('due_date', { ascending: true });
    setEvents(data || []);
    setLoading(false);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'imposto': return <Badge variant="danger" className="text-[8px] uppercase">Imposto</Badge>;
      case 'documento': return <Badge variant="info" className="text-[8px] uppercase">Documento</Badge>;
      case 'pro_labore': return <Badge variant="success" className="text-[8px] uppercase">Pro-Labore</Badge>;
      default: return null;
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic">Sincronizando Agenda...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Agenda Fiscal</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Obrigações e vencimentos da sua empresa</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
           <Calendar className="w-6 h-6" />
        </div>
      </div>

      <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-50">
          {events.map((event) => {
            const isToday = new Date(event.due_date).toDateString() === new Date().toDateString();
            const isOverdue = new Date(event.due_date) < new Date() && event.status === 'pending';

            return (
              <div key={event.id} className={`p-6 flex items-center justify-between hover:bg-slate-50 transition-all group ${isOverdue ? 'bg-red-50/30' : ''}`}>
                <div className="flex items-center gap-6">
                   <div className="flex flex-col items-center justify-center w-12 h-12 bg-white border border-slate-100 rounded-xl shadow-sm shrink-0">
                      <span className="text-[8px] font-black text-slate-400 uppercase">{new Date(event.due_date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                      <span className="text-lg font-black text-slate-900 leading-none">{new Date(event.due_date).getDate()}</span>
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h4 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{event.title}</h4>
                         {getTypeBadge(event.type)}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                         <Clock className="w-3 h-3" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Vencimento: {new Date(event.due_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                   </div>
                </div>

                <div className="flex items-center gap-6">
                   {isOverdue && (
                      <div className="flex items-center gap-1.5 text-red-500 animate-pulse">
                         <AlertCircle className="w-3.5 h-3.5" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Atrasado</span>
                      </div>
                   )}
                   {isToday && (
                      <div className="flex items-center gap-1.5 text-amber-500 font-black uppercase text-[9px] tracking-widest">
                         Vence Hoje
                      </div>
                   )}
                   {event.status === 'done' ? (
                      <div className="flex items-center gap-2 text-emerald-500">
                         <CheckCircle2 className="w-4 h-4" />
                         <span className="text-[9px] font-black uppercase tracking-widest">Concluido</span>
                      </div>
                   ) : (
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                   )}
                </div>
              </div>
            );
          })}
          {events.length === 0 && (
             <div className="p-20 text-center space-y-4">
                <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nenhum evento agendado para os proximos 30 dias</p>
             </div>
          )}
        </div>
      </Card>

      <div className="p-6 bg-slate-100/50 rounded-3xl border border-slate-200/50">
         <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed italic text-center">
            As datas acima sao baseadas no seu enquadramento fiscal atual.<br/>Alertas por e-mail serao enviados com 3 dias de antecedencia.
         </p>
      </div>
    </div>
  );
}
