import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

/**
 * 🧾 PUBLIC LEAD FORM
 * Standard capture form for new prospects.
 * No emojis.
 */

export function LeadForm() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) loadPublicData();
  }, [slug]);

  const loadPublicData = async () => {
    setLoading(true);
    try {
      // Fetch the account using slug (unified schema uses accounts)
      const { data, error: accError } = await supabase
        .from('accounts')
        .select('id, name')
        .eq('id', slug as string) // Assuming slug or ID for now
        .maybeSingle();

      if (accError || !data) {
        setError('Pagina de captura nao encontrada');
        return;
      }

      setAccount(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    setIsSubmitting(true);

    try {
      const { error: submitError } = await supabase.from('leads').insert({
        client_id: account.id, // mapped from account
        name: formData.name || 'Lead Anonimo',
        email: formData.email,
        phone: formData.phone,
        stage: 'NOVO'
      });

      if (submitError) throw submitError;

      alert('Recebemos seus dados! Entraremos em contato em breve.');
      navigate('/');
    } catch (err: any) {
      alert(`Erro ao enviar: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-20 text-center animate-pulse uppercase font-black text-slate-300">Carregando Formulario...</div>;
  if (error) return <div className="p-20 text-center text-red-500 font-bold uppercase">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl p-10 space-y-8 border border-slate-100">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">{account?.name}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Formulario de Contato Oficial</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Completo</label>
             <input 
               required
               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
               onChange={e => setFormData({...formData, name: e.target.value})}
             />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
             <input 
               type="email" required
               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
               onChange={e => setFormData({...formData, email: e.target.value})}
             />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telefone / WhatsApp</label>
             <input 
               required
               className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
               onChange={e => setFormData({...formData, phone: e.target.value})}
             />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase text-xs py-6 rounded-2xl shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'ENVIANDO...' : 'SOLICITAR CONTATO'}
          </button>
        </form>
      </div>
    </div>
  );
}
