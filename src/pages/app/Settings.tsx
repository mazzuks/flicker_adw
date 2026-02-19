import { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { supabase } from '../../lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export function Settings() {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const runSeed = async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('seed_dev_data', { p_companies: 20 });
    if (error) setMsg(`Erro: ${error.message}`);
    else {
      setMsg('✅ 20 Clientes e Processos criados com sucesso!');
      queryClient.invalidateQueries();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>

      {import.meta.env.DEV && (
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
              Se o seu sistema está vazio, você pode popular o banco de dados com 20 clientes
              fictícios distribuídos nas 9 etapas do pipeline para validar a UI.
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
            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-blue-600 animate-bounce">
              <CheckCircle2 className="w-4 h-4" /> {msg}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
