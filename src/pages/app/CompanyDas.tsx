import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  FileText, 
  Download, 
  Calendar,
  Clock,
  ShieldCheck,
} from 'lucide-react';

/**
 * 🧾 DAS GUIDES - CLIENT VIEW
 * Allows entrepreneurs to view and download monthly DAS guides.
 */

export function CompanyDas() {
  const { profile } = useAuth();
  const [guides, setGuides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.account_id) loadGuides();
  }, [profile?.account_id]);

  const loadGuides = async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from('das_guides')
        .select('*')
        .order('month_ref', { ascending: false });
      setGuides(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (path: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('das-guides')
        .download(path);
      
      if (error) throw error;
      
      const url = window.URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path.split('/').pop() || 'guia-das.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert('Erro ao baixar arquivo');
    }
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">Buscando guias disponiveis...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Guia DAS Mensal</h1>
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Acesse e baixe as guias de imposto da sua empresa</p>
        </div>
        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
           <FileText className="w-6 h-6" />
        </div>
      </div>

      <div className="space-y-4">
        {guides.map((guide) => {
          const date = new Date(guide.month_ref);
          const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

          return (
            <Card key={guide.id} className="p-6 border border-slate-200 hover:border-blue-300 transition-all group rounded-[2rem]">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                     <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                        <Calendar className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-slate-800 uppercase italic tracking-tight">{monthName}</h4>
                        <div className="flex items-center gap-3 mt-1">
                           <Badge variant="success" className="text-[8px] px-2 py-0">DISPONIVEL</Badge>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Publicado em: {new Date(guide.created_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                     </div>
                  </div>
                  <Button 
                     onClick={() => handleDownload(guide.storage_path)}
                     variant="secondary" 
                     className="gap-2 bg-slate-900 text-white hover:bg-blue-600 border-none px-6 py-3 h-auto rounded-xl"
                  >
                     <Download className="w-4 h-4" /> Baixar PDF
                  </Button>
               </div>
            </Card>
          );
        })}

        {guides.length === 0 && (
           <div className="p-20 bg-white border border-dashed border-slate-200 rounded-[2.5rem] text-center space-y-4">
              <Clock className="w-12 h-12 text-slate-200 mx-auto" />
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nenhuma guia publicada</p>
                 <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Seu operador contabil ira disponibilizar as guias aqui mensalmente.</p>
              </div>
           </div>
        )}
      </div>

      <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-100/50 flex items-start gap-4">
         <ShieldCheck className="w-6 h-6 text-blue-600 shrink-0" />
         <div>
            <p className="text-xs font-black text-blue-900 uppercase tracking-tight italic">Compliance Fiscal</p>
            <p className="text-xs text-blue-800/60 font-medium leading-relaxed mt-1 uppercase italic">
               O pagamento em dia do DAS e fundamental para manter seu CNPJ regularizado e evitar multas federais.
            </p>
         </div>
      </div>
    </div>
  );
}
