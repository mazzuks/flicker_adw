import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  FilePlus2, 
  Clock, 
  FileText,
} from 'lucide-react';

/**
 * 🧾 NF SOLICITATOR - CLIENT VIEW
 * Allows entrepreneurs to request NF issuance and track status.
 */

export function NfSolicitator() {
  const { profile } = useAuth();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    customer_cnpj_cpf: '',
    amount: '',
    description: ''
  });

  useEffect(() => {
    if (profile?.account_id) loadRequests();
  }, [profile?.account_id]);

  const loadRequests = async () => {
    const { data } = await supabase
      .from('nf_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.account_id) return;
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('nf_requests').insert({
        account_id: profile.account_id,
        requester_id: profile.id,
        customer_cnpj_cpf: formData.customer_cnpj_cpf,
        amount_cents: Math.round(parseFloat(formData.amount.replace(',', '.')) * 100),
        description: formData.description,
        status: 'pending'
      });

      if (error) throw error;
      
      setFormData({ customer_cnpj_cpf: '', amount: '', description: '' });
      await loadRequests();
      alert('Solicitacao enviada com sucesso!');
    } catch (err: any) {
      alert(`Erro: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="info">PENDENTE</Badge>;
      case 'approved': return <Badge variant="warning">EMISSAO</Badge>;
      case 'issued': return <Badge variant="success">EMITIDA</Badge>;
      case 'rejected': return <Badge variant="danger">REJEITADA</Badge>;
      default: return null;
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic">CARREGANDO NOTAS...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Notas Fiscais</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Solicite a emissao de notas para seus clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 space-y-6">
           <Card className="p-8 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem]">
              <h3 className="text-sm font-black uppercase tracking-widest mb-8 italic text-slate-900 flex items-center gap-2">
                 <FilePlus2 className="w-4 h-4 text-blue-600" /> Nova Solicitacao
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">CNPJ ou CPF do Tomador</label>
                    <input 
                       required
                       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                       placeholder="00.000.000/0001-00"
                       value={formData.customer_cnpj_cpf}
                       onChange={e => setFormData({...formData, customer_cnpj_cpf: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor do Servico (R$)</label>
                    <input 
                       required
                       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
                       placeholder="0,00"
                       value={formData.amount}
                       onChange={e => setFormData({...formData, amount: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descricao dos Servicos</label>
                    <textarea 
                       required
                       className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all min-h-[100px] resize-none"
                       placeholder="Ex: Consultoria em marketing digital ref. Fevereiro"
                       value={formData.description}
                       onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>
                 <Button type="submit" isLoading={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs py-6 rounded-2xl shadow-lg shadow-blue-200">
                    Enviar Pedido
                 </Button>
              </form>
           </Card>
        </div>

        <div className="lg:col-span-7">
           <Card noPadding className="border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                 <h3 className="text-xs font-black uppercase tracking-widest italic text-slate-900">Ultimas Solicitacoes</h3>
                 <FileText className="w-4 h-4 text-slate-300" />
              </div>
              <div className="divide-y divide-slate-50">
                 {requests.map((req) => (
                    <div key={req.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-all group">
                       <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{req.customer_cnpj_cpf}</p>
                          <div className="flex items-center gap-3">
                             <span className="text-[10px] font-black text-slate-900 italic">R$ {(req.amount_cents / 100).toLocaleString('pt-BR')}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(req.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          {getStatusBadge(req.status)}
                          {req.status === 'issued' && (
                             <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                                <FileText className="w-4 h-4" />
                             </button>
                          )}
                       </div>
                    </div>
                 ))}
                 {requests.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                       <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto border border-slate-100">
                          <Clock className="w-6 h-6 text-slate-200" />
                       </div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nenhuma nota emitida ainda</p>
                    </div>
                 )}
              </div>
           </Card>
        </div>

      </div>
    </div>
  );
}
