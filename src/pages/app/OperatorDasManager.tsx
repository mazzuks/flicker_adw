import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { Card } from '../../components/ui/Card';
import { 
  ArrowLeft, 
  Upload, 
  FileText,
} from 'lucide-react';

/**
 * 🎧 OPERATOR DAS MANAGER
 * Allows operators to upload DAS guides for a specific account.
 */

export function OperatorDasManager() {
  const { accountId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [account, setAccount] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`);

  useEffect(() => {
    if (!accountId) {
      setError('ID da conta nao fornecido');
      setLoading(false);
      return;
    }
    loadAccount();
  }, [accountId]);

  const loadAccount = async () => {
    if (!accountId) return;
    const { data } = await supabase.from('accounts').select('name').eq('id', accountId).single();
    setAccount(data);
    setLoading(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !accountId) return;

    setUploading(true);
    try {
      const monthRef = selectedMonth;
      const fileName = `${monthRef}.pdf`;
      const storagePath = `${accountId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('das-guides')
        .upload(storagePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('das_guides').upsert({
        account_id: accountId,
        month_ref: monthRef,
        storage_path: storagePath,
        status: 'available'
      }, { onConflict: 'account_id, month_ref' });

      if (dbError) throw dbError;

      alert('Guia DAS enviada com sucesso!');
    } catch (err: any) {
      alert(`Erro no processo: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300">CARREGANDO CONTA...</div>;
  if (error) return <div className="p-10 text-red-500 font-bold uppercase">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center gap-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
           <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div>
           <h1 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter">Publicar Guia DAS</h1>
           <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-1">Conta: {account?.name}</p>
        </div>
      </div>

      <Card className="p-10 border border-slate-200 shadow-xl shadow-slate-200/50 rounded-[2.5rem] space-y-8">
         <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mes de Referencia</label>
            <input 
               type="date"
               className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-bold focus:border-blue-600 outline-none transition-all"
               value={selectedMonth}
               onChange={e => setSelectedMonth(e.target.value)}
            />
         </div>

         <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Upload da Guia (PDF)</label>
            <label className="border-2 border-dashed border-slate-200 rounded-3xl p-16 text-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer block relative">
               <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileUpload} disabled={uploading} />
               <div className="space-y-4">
                  <div className={`w-16 h-16 rounded-[1.5rem] mx-auto flex items-center justify-center ${uploading ? 'bg-blue-600 shadow-blue-100' : 'bg-white border border-slate-100 shadow-sm'}`}>
                     <Upload className="w-8 h-8 text-white animate-bounce" />
                  </div>
                  <div>
                     <p className="text-sm font-black text-slate-700 uppercase tracking-tight italic">{uploading ? 'PROCESSANDO ENVIO...' : 'CLIQUE OU ARRASTE O PDF AQUI'}</p>
                     <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest italic">Apenas arquivos PDF (Max 10MB)</p>
                  </div>
               </div>
            </label>
         </div>
      </Card>
    </div>
  );
}
