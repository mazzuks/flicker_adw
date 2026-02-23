import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { runSmokeTest } from '../../services/smokeTest';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  Activity,
  Trash2
} from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const executeSeed = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.rpc('seed_dev_data');
      if (error) throw error;
      setMsg({ type: 'success', text: '✅ Dados de teste gerados com sucesso!' });
      await queryClient.invalidateQueries();
    } catch (e: any) {
      setMsg({ type: 'error', text: `Erro: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const executeSmokeTest = async () => {
    setLoading(true);
    const results = await runSmokeTest();
    setTestResults(results);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase">Configurações</h1>

      <Card className="border border-slate-200 shadow-sm overflow-hidden" noPadding>
         <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
               <Activity className="w-5 h-5 text-blue-600" />
               <h3 className="font-bold text-slate-900 text-xs uppercase tracking-widest italic">Health Check (Smoke Test)</h3>
            </div>
            <Button size="sm" onClick={executeSmokeTest} isLoading={loading} variant="secondary" className="gap-2">
               <RefreshCw className="w-4 h-4" /> Executar Diagnostico
            </Button>
         </div>
         <div className="p-6">
            {!testResults ? (
               <p className="text-xs text-slate-400 font-medium italic">Execute o diagnostico para validar a integridade do banco de dados.</p>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatusItem label="Tabelas Core" success={testResults.tables} />
                  <StatusItem label="Views Dashboard" success={testResults.views} />
                  <StatusItem label="Funcoes RPC" success={testResults.rpc} />
                  <StatusItem label="RLS & Seguranca" success={testResults.rls} />
               </div>
            )}
            {testResults?.errors.length > 0 && (
               <div className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">Inconsistencias Detectadas:</p>
                  <ul className="space-y-1">
                     {testResults.errors.map((err: string, i: number) => (
                        <li key={i} className="text-xs text-red-700 font-medium flex items-center gap-2">
                           <AlertCircle className="w-3 h-3" /> {err}
                        </li>
                     ))}
                  </ul>
               </div>
            )}
         </div>
      </Card>

      <Card className="border-dashed border-blue-200 bg-blue-50/30 p-8 rounded-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm italic">Ambiente de Desenvolvimento</h3>
            <p className="text-xs text-slate-500 font-medium">Reset e populacao de dados seed.</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
           <Button onClick={executeSeed} isLoading={loading} variant="primary" className="bg-blue-600 shadow-lg shadow-blue-200 px-8">
             Popular Sistema (20 Clientes)
           </Button>
           <Button variant="secondary" className="bg-white hover:bg-red-50 hover:text-red-600 border-slate-200">
             <Trash2 className="w-4 h-4 mr-2" /> Resetar Banco
           </Button>
        </div>

        {msg && (
          <div className={`mt-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-bold animate-in zoom-in ${
            msg.type === 'success' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            {msg.text}
          </div>
        )}
      </Card>
    </div>
  );
}

function StatusItem({ label, success }: { label: string, success: boolean }) {
   return (
      <div className={`p-4 rounded-xl border flex flex-col items-center gap-3 text-center transition-all ${success ? 'bg-white border-slate-100 shadow-sm' : 'bg-red-50 border-red-100'}`}>
         {success ? <ShieldCheck className="w-6 h-6 text-emerald-500" /> : <AlertCircle className="w-6 h-6 text-red-500" />}
         <span className={`text-[9px] font-black uppercase tracking-widest ${success ? 'text-slate-400' : 'text-red-500'}`}>{label}</span>
      </div>
   )
}
