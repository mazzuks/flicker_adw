import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { CheckCircle, Circle, ArrowRight, ArrowLeft } from 'lucide-react';

interface Step {
  key: string;
  label: string;
  description: string;
}

const STEPS: Step[] = [
  { key: 'company_data', label: 'Dados da Empresa', description: 'Nome, segmento e localização' },
  { key: 'address', label: 'Endereço', description: 'Endereço completo da empresa' },
  { key: 'partners', label: 'Sócios', description: 'Informações dos sócios' },
  { key: 'activity', label: 'Atividade', description: 'O que sua empresa faz' },
  { key: 'taxes', label: 'Impostos', description: 'Regime tributário' },
  { key: 'documents', label: 'Documentos', description: 'Upload de documentos' },
  { key: 'certificate', label: 'Certificado Digital', description: 'Solicitar certificado' },
  { key: 'domain', label: 'Domínio', description: 'Escolha seu domínio' },
  { key: 'email', label: 'Email Corporativo', description: 'Configure seu email' },
  { key: 'site', label: 'Site', description: 'Crie seu site' },
  { key: 'brand', label: 'Marca', description: 'Registro de marca' },
  { key: 'crm', label: 'CRM', description: 'Configure seu CRM' },
];

export function Onboarding() {
  const { currentClientId } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepStatuses, setStepStatuses] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentClientId) {
      loadOnboardingData();
    }
  }, [currentClientId]);

  const loadOnboardingData = async () => {
    if (!currentClientId) return;

    const { data: steps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('client_id', currentClientId);

    if (steps) {
      const statuses: Record<string, string> = {};
      steps.forEach(step => {
        statuses[step.step_key] = step.status;
      });
      setStepStatuses(statuses);

      const firstIncomplete = STEPS.findIndex(s => !statuses[s.key] || statuses[s.key] === 'NOT_STARTED');
      if (firstIncomplete !== -1) {
        setCurrentStepIndex(firstIncomplete);
      }
    } else {
      await initializeSteps();
    }

    setLoading(false);
  };

  const initializeSteps = async () => {
    if (!currentClientId) return;

    const stepsToInsert = STEPS.map(step => ({
      client_id: currentClientId,
      step_key: step.key,
      status: 'NOT_STARTED',
      data_json: {},
    }));

    await supabase.from('onboarding_steps').insert(stepsToInsert);
    await loadOnboardingData();
  };

  const saveStep = async () => {
    if (!currentClientId) return;

    const currentStep = STEPS[currentStepIndex];

    await supabase
      .from('onboarding_steps')
      .upsert({
        client_id: currentClientId,
        step_key: currentStep.key,
        status: 'IN_PROGRESS',
        data_json: formData,
      });

    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      setFormData({});
    }
  };

  const currentStep = STEPS[currentStepIndex];
  const progress = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cadastro da Empresa</h1>
        <p className="text-gray-600 mt-1">Complete as informações para começar</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progresso</span>
            <span className="text-sm font-medium text-blue-600">{progress}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {STEPS.map((step, index) => (
            <button
              key={step.key}
              onClick={() => setCurrentStepIndex(index)}
              className={`p-3 rounded-lg text-left transition-colors ${
                index === currentStepIndex
                  ? 'bg-blue-50 border-2 border-blue-600'
                  : stepStatuses[step.key] === 'APPROVED'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                {stepStatuses[step.key] === 'APPROVED' ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs font-medium text-gray-900">{index + 1}</span>
              </div>
              <p className="text-xs text-gray-700 line-clamp-1">{step.label}</p>
            </button>
          ))}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentStep.label}</h2>
          <p className="text-gray-600">{currentStep.description}</p>
        </div>

        <div className="space-y-6 mb-8">
          {currentStep.key === 'company_data' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome fantasia
                </label>
                <input
                  type="text"
                  value={formData.fantasy_name || ''}
                  onChange={(e) => setFormData({ ...formData, fantasy_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Como sua empresa será conhecida"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Segmento
                </label>
                <select
                  value={formData.segment || ''}
                  onChange={(e) => setFormData({ ...formData, segment: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione</option>
                  <option value="commerce">Comércio</option>
                  <option value="service">Serviços</option>
                  <option value="industry">Indústria</option>
                  <option value="technology">Tecnologia</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={2}
                    placeholder="UF"
                  />
                </div>
              </div>
            </>
          )}

          {currentStep.key !== 'company_data' && (
            <div className="text-center py-12 text-gray-600">
              Formulário para {currentStep.label} será implementado aqui
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="flex items-center space-x-2 px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Anterior</span>
          </button>

          <button
            onClick={saveStep}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span>{currentStepIndex === STEPS.length - 1 ? 'Finalizar' : 'Próximo passo'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
