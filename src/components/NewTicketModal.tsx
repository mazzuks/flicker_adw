import { useState, useEffect } from 'react';
import { X, Building2, Briefcase, FileText, Zap, CheckCircle2, Loader2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialStatus: string;
}

export function NewTicketModal({ isOpen, onClose, onSuccess, initialStatus }: NewTicketModalProps) {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<{ id: string; name: string; fantasy_name: string }[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    type: 'TICKET_CNPJ',
    priority: 'NORMAL',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

  const loadClients = async () => {
    const { data } = await supabase.from('clients').select('id, name, fantasy_name').order('name');
    if (data) setClients(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) return;

    setLoading(true);
    const { error } = await supabase.from('tickets').insert({
      client_id: formData.client_id,
      type: formData.type,
      priority: formData.priority,
      status: initialStatus,
      data_json: {
        description: formData.description,
        created_via: 'operator_board',
      },
    });

    if (!error) {
      onSuccess();
      onClose();
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-adworks-dark/80 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-adworks-gray/30">
          <div>
            <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
              Operacional
            </span>
            <h2 className="text-2xl font-black text-adworks-dark mt-2 italic uppercase tracking-tighter">
              Novo Processo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Cliente / Empresa
            </label>
            <select
              required
              value={formData.client_id}
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
              className="w-full px-5 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark outline-none"
            >
              <option value="">Selecione um cliente...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.fantasy_name || c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Tipo de Serviço
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-5 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark outline-none"
              >
                <option value="TICKET_CNPJ">CNPJ</option>
                <option value="TICKET_INPI">MARCA</option>
                <option value="TICKET_FISCAL">FISCAL</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                Prioridade
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-5 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark outline-none"
              >
                <option value="LOW">BAIXA</option>
                <option value="NORMAL">NORMAL</option>
                <option value="HIGH">ALTA</option>
                <option value="URGENT">URGENTE</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
              Notas Iniciais (Opcional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-5 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark outline-none min-h-[100px]"
              placeholder="Descreva o objetivo deste processo..."
            />
          </div>

          <button
            type="submit"
            disabled={loading || !formData.client_id}
            className="w-full bg-adworks-dark text-white py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-adworks-blue transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-30"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
            CRIAR PROCESSO AGORA
          </button>
        </form>
      </div>
    </div>
  );
}
