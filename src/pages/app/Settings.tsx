import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Database, CheckCircle2, AlertCircle } from 'lucide-react';

export function Settings() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const runSeed = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const { data, error } = await supabase.rpc('seed_dev_data', { p_companies: 20 });

      if (error) {
        setMsg({ type: 'error', text: `Erro RPC: ${error.message}` });
      } else {
        setMsg({ type: 'success', text: '✅ 20 Clientes e Processos criados com sucesso!' });
        await queryClient.invalidateQueries();
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: `Erro inesperado: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>

      <Card className="border-dashed border-blue-200 bg-blue-50/30">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-tight">Developer Tools</h3>
            <p className="text-xs text-slate-500 font-medium">
              Ferramentas para ambiente de desenvolvimento.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed mb-8">
          <p>
            Clique abaixo para popular o banco de dados via RPC oficial. Isso criará 20 empresas e
            processos distribuídos em todas as etapas do pipeline.
          </p>
        </div>

        <Button
          onClick={runSeed}
          isLoading={loading}
          variant="secondary"
          className="w-full sm:w-auto"
        >
          SEED DEV DATA (20 CLIENTES)
        </Button>

        {msg && (
          <div
            className={`mt-4 flex items-center gap-2 text-xs font-bold ${
              msg.type === 'success' ? 'text-blue-600 animate-bounce' : 'text-red-600'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            {msg.text}
          </div>
        )}
      </Card>
    </div>
  );
}
