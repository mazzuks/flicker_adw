import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { 
  CheckCircle2, 
  Circle, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  FileCheck,
  Zap
} from 'lucide-react';

/**
 * ✅ ACCOUNTING CHECKLIST - CLIENT VIEW
 * Visual progress of the company setup/activation.
 */

export function AccountChecklist() {
  const { profile } = useAuth();
  const [checklist, setChecklist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.account_id) loadChecklist();
  }, [profile?.account_id]);

  const loadChecklist = async () => {
    const { data } = await supabase
      .from('account_checklist')
      .select('*')
      .eq('account_id', profile?.account_id as string)
      .maybeSingle();
    setChecklist(data);
    setLoading(false);
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic">CARREGANDO STATUS...</div>;

  const items = [
    { label: 'CNAE Validado', done: checklist?.cnae_validado, icon: ShieldCheck },
    { label: 'Regime Definido', done: checklist?.regime_definido, icon: Building2 },
    { label: 'Certificado Digital', done: checklist?.certificado_emitido, icon: FileCheck },
    { label: 'Conta Bancária PJ', done: checklist?.conta_bancaria_created, icon: CreditCard },
    { label: 'Portal Fiscal Ativo', done: checklist?.portal_fiscal_ativo, icon: Zap },
  ];

  const doneCount = items.filter(i => i.done).length;
  const isComplete = doneCount === items.length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Status de Ativacao</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acompanhe o setup contabil da sua empresa</p>
        </div>
        <div className="flex flex-col items-end gap-1">
           <Badge variant={isComplete ? 'success' : 'info'} className="px-4 py-1 text-[10px] font-black uppercase tracking-widest">
              {isComplete ? 'CONCLUIDO' : 'EM ANDAMENTO'}
           </Badge>
           <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{doneCount} de {items.length} etapas</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-8 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] md:col-span-2">
           <div className="space-y-6">
              {items.map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-6 rounded-3xl border transition-all ${item.done ? 'bg-emerald-50/50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                   <div className="flex items-center gap-6">
                      <div className={`p-3 rounded-2xl ${item.done ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-300 border border-slate-100 shadow-sm'}`}>
                         <item.icon className="w-6 h-6" />
                      </div>
                      <span className={`text-base font-bold uppercase tracking-tight italic ${item.done ? 'text-emerald-900' : 'text-slate-400'}`}>
                         {item.label}
                      </span>
                   </div>
                   {item.done ? (
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 animate-in zoom-in duration-500" />
                   ) : (
                      <Circle className="w-8 h-8 text-slate-200" />
                   )}
                </div>
              ))}
           </div>
        </Card>

        <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200 text-white flex flex-col justify-center gap-4">
           <h3 className="text-sm font-black uppercase tracking-widest italic opacity-50">Dica do Contador</h3>
           <p className="text-lg font-bold leading-tight">Mantenha seu Certificado Digital sempre atualizado para evitar bloqueios na emissao de notas.</p>
        </div>

        <div className="p-8 bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200 text-white flex flex-col justify-center gap-4">
           <h3 className="text-sm font-black uppercase tracking-widest italic opacity-30">Suporte Tecnico</h3>
           <p className="text-sm font-medium text-slate-400">Restou alguma duvida sobre o processo de ativacao? Chame nosso time no Inbox agora mesmo.</p>
           <button className="w-fit px-6 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Abrir Suporte</button>
        </div>
      </div>
    </div>
  );
}
