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
      // 🚀 CHAVE DA SOLUÇÃO: Chamada limpa sem nenhum parâmetro
      const { data, error } = await supabase.rpc('seed_dev_data');

      if (error) {
        console.error('RPC Error Detail:', error);
        setMsg({ type: 'error', text: `Erro: ${error.message}` });
      } else {
        setMsg({ type: 'success', text: '✅ Sistema populado com 20 empresas!' });
        await queryClient.invalidateQueries();
      }
    } catch (e: any) {
      setMsg({ type: 'error', text: `Erro fatal: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>

      <Card className="border-dashed border-blue-200 bg-blue-50/30 p-8 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-blue-600 text-white rounded-xl shadow-lg">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 uppercase tracking-tight text-sm">
              Ferramentas de Desenvolvedor
            </h3>
            <p className="text-xs text-slate-500 font-medium">Reset e população de dados.</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed mb-8">
          Atenção: Use o botão abaixo apenas se o seu sistema estiver vazio. Ele criará
          automaticamente 20 empresas de teste distribuídas pelo pipeline.
        </p>

        <Button
          onClick={runSeed}
          isLoading={loading}
          variant="secondary"
          className="w-full sm:w-auto bg-slate-900 text-white hover:bg-blue-600"
        >
          EXECUTAR SEED DE DADOS (v4)
        </Button>

        {msg && (
          <div
            className={`mt-6 p-4 rounded-xl border flex items-center gap-3 text-xs font-bold animate-in zoom-in ${
              msg.type === 'success'
                ? 'bg-green-50 text-green-600 border-green-100'
                : 'bg-red-50 text-red-600 border-red-100'
            }`}
          >
            {msg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            {msg.text}
          </div>
        )}
      </Card>
    </div>
  );
}
