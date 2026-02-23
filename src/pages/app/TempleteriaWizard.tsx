import {
  Wand2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layout,
  Info,
  AlertCircle,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../lib/auth';
import { templeteriaEngine } from '../../services/templeteriaEngine';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

const WIZARD_STEPS = [
  { id: 1, label: 'Nicho', desc: 'Qual o ramo da empresa?' },
  { id: 2, label: 'Objetivo', desc: 'O que o site deve fazer?' },
  { id: 3, label: 'Publico', desc: 'Para quem vamos vender?' },
  { id: 4, label: 'Diferenciais', desc: 'O que te torna unico?' },
  { id: 5, label: 'Tom de Voz', desc: 'Formal, descontraido, tecnico?' },
  { id: 6, label: 'Cores', desc: 'Identidade visual base.' },
  { id: 7, label: 'Servicos', desc: 'O que voce oferece?' },
  { id: 8, label: 'Depoimentos', desc: 'Prova social (opcional).' },
  { id: 9, label: 'Contatos', desc: 'WhatsApp, E-mail, Local.' },
  { id: 10, label: 'Estrutura', desc: 'Paginas desejadas.' },
  { id: 11, label: 'Dominio', desc: 'Sugestao de nome.' },
  { id: 12, label: 'Revisao', desc: 'Confirmar e gerar site.' },
];

export function TempleteriaWizard() {
  const { profile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = () => {
    if (currentStep < 12) setCurrentStep((prev) => prev + 1);
    else handleGenerate();
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleGenerate = async () => {
    if (!profile?.account_id) {
      setError('Sessao invalida: account_id nao encontrado');
      return;
    }
    setIsGenerating(true);
    setError(null);

    try {
      const site = await templeteriaEngine.generateSiteDraft({
        account_id: profile.account_id,
        siteName: answers[11] || 'Novo Projeto',
        businessType: answers[1] || 'Negocio Geral',
        tone: answers[5] || 'Neutro',
        palette: answers[6] || '#2563eb',
        sections: ['hero', 'services', 'contact'],
      });

      if (!site?.siteId) throw new Error('Falha ao obter ID do projeto');
      navigate(`/app/refiner/${site.siteId}`);
    } catch (err: any) {
      console.error('Generation failure:', err);
      setError(err.message || 'Falha ao gerar site via IA');
      setIsGenerating(false);
    }
  };

  const progress = (currentStep / 12) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-xl shadow-lg">
              <Wand2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">
                Templeteria
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic leading-none">
                Criacao Guiada por IA
              </p>
            </div>
          </div>
          <Badge
            variant="neutral"
            className="bg-slate-100 text-slate-500 border-none font-black text-[10px]"
          >
            PASSO {currentStep} DE 12
          </Badge>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="bg-blue-600 h-full transition-all duration-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <main className="min-h-[400px] flex flex-col">
        {isGenerating ? (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6 animate-pulse">
            <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-inner relative">
              <Sparkles className="w-12 h-12" />
              <div className="absolute inset-0 border-4 border-blue-200 rounded-[2rem] border-t-blue-600 animate-spin" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">
                O Motor de IA esta criando seu site...
              </h3>
              <p className="text-sm text-slate-400 font-bold italic mt-2 uppercase tracking-widest">
                Processando nicho e componentes visuais.
              </p>
            </div>
          </div>
        ) : (
          <Card className="flex-1 border border-slate-200 shadow-xl shadow-slate-200/50 p-12 rounded-[2rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Layout className="w-64 h-64 text-slate-900" />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight uppercase italic">
                  {WIZARD_STEPS[currentStep - 1].label}
                </h2>
                <p className="text-lg text-slate-500 font-bold tracking-tight uppercase italic opacity-60">
                  {WIZARD_STEPS[currentStep - 1].desc}
                </p>
              </div>

              <div className="space-y-4">
                <textarea
                  autoFocus
                  placeholder="Descreva aqui..."
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-8 text-lg font-medium focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 focus:bg-white outline-none min-h-[150px] transition-all shadow-inner"
                  value={answers[currentStep] || ''}
                  onChange={(e) => setAnswers({ ...answers, [currentStep]: e.target.value })}
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-500">
                    <AlertCircle className="w-4 h-4" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 text-slate-400">
                  <Info className="w-4 h-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest italic opacity-50">
                    A IA usara sua resposta para gerar textos profissionais.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </main>

      <footer className="flex items-center justify-between gap-6 px-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1 || isGenerating}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-slate-900 disabled:opacity-0 transition-all italic"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar
        </button>

        <div className="flex items-center gap-6">
          <Button
            onClick={handleNext}
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-200 px-12 py-7 h-auto rounded-3xl text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 transition-all hover:scale-105 active:scale-95 group italic"
          >
            {currentStep === 12 ? 'GERAR MEU SITE' : 'PROXIMO PASSO'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
