import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { 
  CheckCircle, 
  Circle, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Globe, 
  Search, 
  Zap, 
  XCircle,
  CheckCircle2
} from 'lucide-react';

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
  const [generating, setGenerating] = useState(false);
  const [domainStatus, setDomainStatus] = useState<{available: boolean, domain: string} | null>(null);

  const checkDomain = async () => {
    if (!formData.domain_name) return;
    setGenerating(true);
    try {
      const domain = `${formData.domain_name}${formData.domain_extension || '.com.br'}`;
      const { data, error } = await supabase.functions.invoke('domain-checker', {
        body: { domain }
      });
      if (!error) setDomainStatus(data);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (currentClientId) {
      loadOnboardingData();
    }
  }, [currentClientId]);

  useEffect(() => {
    if (currentClientId && currentStepIndex >= 0) {
      loadStepData(STEPS[currentStepIndex].key);
    }
  }, [currentStepIndex, currentClientId]);

  const loadOnboardingData = async () => {
    if (!currentClientId) return;

    const { data: steps } = await supabase
      .from('onboarding_steps')
      .select('*')
      .eq('client_id', currentClientId);

    if (steps && steps.length > 0) {
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

  const loadStepData = async (stepKey: string) => {
    if (!currentClientId) return;

    const { data } = await supabase
      .from('onboarding_steps')
      .select('data_json')
      .eq('client_id', currentClientId)
      .eq('step_key', stepKey)
      .maybeSingle();

    if (data && data.data_json) {
      setFormData(data.data_json);
    } else {
      setFormData({});
    }
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
    } else {
      await supabase
        .from('onboarding_steps')
        .update({ status: 'SUBMITTED' })
        .eq('client_id', currentClientId)
        .eq('step_key', currentStep.key);

      alert('Onboarding concluído! Nossa equipe irá revisar suas informações.');
    }
  };

  const renderStepContent = () => {
    const currentStep = STEPS[currentStepIndex];

    switch (currentStep.key) {
      case 'company_data':
        return (
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
                <option value="consulting">Consultoria</option>
                <option value="food">Alimentação</option>
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
        );

      case 'address':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                CEP
              </label>
              <input
                type="text"
                value={formData.cep || ''}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="00000-000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logradouro
              </label>
              <input
                type="text"
                value={formData.street || ''}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Rua, Avenida, etc."
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={formData.number || ''}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Complemento
                </label>
                <input
                  type="text"
                  value={formData.complement || ''}
                  onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Sala, Andar, etc."
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro
              </label>
              <input
                type="text"
                value={formData.neighborhood || ''}
                onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </>
        );

      case 'partners':
        const partners = formData.partners || [{ name: '', cpf: '', participation: '' }];
        return (
          <>
            <div className="space-y-4">
              {partners.map((partner: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900">Sócio {index + 1}</h3>
                    {partners.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newPartners = partners.filter((_: any, i: number) => i !== index);
                          setFormData({ ...formData, partners: newPartners });
                        }}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome completo
                    </label>
                    <input
                      type="text"
                      value={partner.name || ''}
                      onChange={(e) => {
                        const newPartners = [...partners];
                        newPartners[index].name = e.target.value;
                        setFormData({ ...formData, partners: newPartners });
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={partner.cpf || ''}
                        onChange={(e) => {
                          const newPartners = [...partners];
                          newPartners[index].cpf = e.target.value;
                          setFormData({ ...formData, partners: newPartners });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Participação (%)
                      </label>
                      <input
                        type="number"
                        value={partner.participation || ''}
                        onChange={(e) => {
                          const newPartners = [...partners];
                          newPartners[index].participation = e.target.value;
                          setFormData({ ...formData, partners: newPartners });
                        }}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                const newPartners = [...partners, { name: '', cpf: '', participation: '' }];
                setFormData({ ...formData, partners: newPartners });
              }}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar sócio</span>
            </button>
          </>
        );

      case 'activity':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descreva a atividade principal da sua empresa
              </label>
              <textarea
                value={formData.activity_description || ''}
                onChange={(e) => setFormData({ ...formData, activity_description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Ex: Comércio varejista de roupas e acessórios"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                A empresa vai vender produtos ou serviços?
              </label>
              <select
                value={formData.business_type || ''}
                onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="products">Produtos</option>
                <option value="services">Serviços</option>
                <option value="both">Ambos</option>
              </select>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Nossa equipe irá sugerir as melhores CNAEs (códigos de atividade) com base na sua descrição.
              </p>
            </div>
          </>
        );

      case 'taxes':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Qual será o faturamento mensal estimado?
              </label>
              <select
                value={formData.estimated_revenue || ''}
                onChange={(e) => setFormData({ ...formData, estimated_revenue: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="up_to_20k">Até R$ 20.000</option>
                <option value="20k_to_50k">R$ 20.000 a R$ 50.000</option>
                <option value="50k_to_100k">R$ 50.000 a R$ 100.000</option>
                <option value="100k_to_300k">R$ 100.000 a R$ 300.000</option>
                <option value="above_300k">Acima de R$ 300.000</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                A empresa já possui faturamento?
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="has_revenue"
                    value="no"
                    checked={formData.has_revenue === 'no'}
                    onChange={(e) => setFormData({ ...formData, has_revenue: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Não, é uma empresa nova</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="has_revenue"
                    value="yes"
                    checked={formData.has_revenue === 'yes'}
                    onChange={(e) => setFormData({ ...formData, has_revenue: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sim, já estou faturando</span>
                </label>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium mb-1">
                Sugestão: Simples Nacional
              </p>
              <p className="text-sm text-blue-800">
                Baseado no seu faturamento estimado, o Simples Nacional parece a melhor opção. Nossa equipe irá confirmar após análise completa.
              </p>
            </div>
          </>
        );

      case 'documents':
        return (
          <div className="text-center py-8">
            <p className="text-gray-700 mb-4">
              Os documentos necessários serão solicitados na próxima etapa.
            </p>
            <p className="text-sm text-gray-600">
              Você poderá enviá-los através da seção "Documentos" no menu principal.
            </p>
          </div>
        );

      case 'certificate':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precisa de certificado digital (e-CNPJ)?
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="needs_certificate"
                    value="yes"
                    checked={formData.needs_certificate === 'yes'}
                    onChange={(e) => setFormData({ ...formData, needs_certificate: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sim, preciso</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="needs_certificate"
                    value="no"
                    checked={formData.needs_certificate === 'no'}
                    onChange={(e) => setFormData({ ...formData, needs_certificate: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Não preciso agora</span>
                </label>
              </div>
            </div>
            {formData.needs_certificate === 'yes' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Iremos providenciar o certificado digital para você. Entraremos em contato em breve.
                </p>
              </div>
            )}
          </>
        );

      case 'domain':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">
                Qual domínio deseja para sua empresa?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                  <input
                    type="text"
                    value={formData.domain_name || ''}
                    onChange={(e) => setFormData({ ...formData, domain_name: e.target.value })}
                    className="w-full pl-11 pr-4 py-4 bg-white border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                    placeholder="minhaempresa"
                  />
                </div>
                <select
                  value={formData.domain_extension || '.com.br'}
                  onChange={(e) => setFormData({ ...formData, domain_extension: e.target.value })}
                  className="px-6 py-4 bg-white border-none rounded-2xl shadow-inner focus:ring-2 focus:ring-adworks-blue font-black text-xs uppercase tracking-widest"
                >
                  <option value=".com.br">.com.br</option>
                  <option value=".com">.com</option>
                  <option value=".net">.net</option>
                  <option value=".app">.app</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={checkDomain}
              disabled={generating || !formData.domain_name}
              className="w-full bg-adworks-dark text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-adworks-blue transition-all shadow-xl disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {generating ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <Search className="w-4 h-4" />}
              VERIFICAR DISPONIBILIDADE
            </button>

            {domainStatus && (
              <div className={`p-6 rounded-[2rem] border-2 animate-in zoom-in duration-300 ${domainStatus.available ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm ${domainStatus.available ? 'text-green-500' : 'text-red-500'}`}>
                    {domainStatus.available ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-black uppercase tracking-tighter italic text-lg leading-none mb-1">{domainStatus.domain}</p>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-70">
                      {domainStatus.available ? 'Está disponível! Podemos registrar agora.' : 'Já possui dono. Tente outra variação.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-100 rounded-3xl p-6 flex gap-4">
              <Zap className="w-6 h-6 text-adworks-blue shrink-0" />
              <p className="text-xs font-medium text-blue-700 leading-relaxed italic">
                "Um domínio curto e fácil de lembrar aumenta em 30% a conversão dos seus anúncios digitais."
              </p>
            </div>
          </div>
        );

      case 'email':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prefere Google Workspace ou Microsoft 365?
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="email_provider"
                    value="google"
                    checked={formData.email_provider === 'google' || !formData.email_provider}
                    onChange={(e) => setFormData({ ...formData, email_provider: e.target.value })}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Google Workspace</span>
                    <p className="text-xs text-gray-600">Gmail, Drive, Meet (Recomendado)</p>
                  </div>
                </label>
                <label className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input
                    type="radio"
                    name="email_provider"
                    value="microsoft"
                    checked={formData.email_provider === 'microsoft'}
                    onChange={(e) => setFormData({ ...formData, email_provider: e.target.value })}
                    className="text-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">Microsoft 365</span>
                    <p className="text-xs text-gray-600">Outlook, OneDrive, Teams</p>
                  </div>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email principal desejado
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={formData.email_user || ''}
                  onChange={(e) => setFormData({ ...formData, email_user: e.target.value })}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="contato"
                />
                <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                  @{formData.domain_name || 'seudominio'}{formData.domain_extension || '.com.br'}
                </span>
              </div>
            </div>
          </>
        );

      case 'site':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deseja um site institucional?
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wants_site"
                    value="yes"
                    checked={formData.wants_site === 'yes'}
                    onChange={(e) => setFormData({ ...formData, wants_site: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sim, quero um site</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wants_site"
                    value="no"
                    checked={formData.wants_site === 'no'}
                    onChange={(e) => setFormData({ ...formData, wants_site: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Não preciso agora</span>
                </label>
              </div>
            </div>
            {formData.wants_site === 'yes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escolha um template
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {['modern', 'classic', 'minimal'].map((template) => (
                      <button
                        key={template}
                        type="button"
                        onClick={() => setFormData({ ...formData, site_template: template })}
                        className={`p-4 border-2 rounded-lg text-center transition-colors ${
                          formData.site_template === template
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-900 capitalize">{template}</p>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição da empresa (para o site)
                  </label>
                  <textarea
                    value={formData.site_description || ''}
                    onChange={(e) => setFormData({ ...formData, site_description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Texto que aparecerá no site"
                  />
                </div>
              </>
            )}
          </>
        );

      case 'brand':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deseja registrar a marca no INPI?
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wants_brand"
                    value="yes"
                    checked={formData.wants_brand === 'yes'}
                    onChange={(e) => setFormData({ ...formData, wants_brand: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Sim, quero proteger minha marca</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="wants_brand"
                    value="no"
                    checked={formData.wants_brand === 'no'}
                    onChange={(e) => setFormData({ ...formData, wants_brand: e.target.value })}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Não preciso agora</span>
                </label>
              </div>
            </div>
            {formData.wants_brand === 'yes' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome da marca a registrar
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name || ''}
                    onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Classe (segmento)
                  </label>
                  <select
                    value={formData.brand_class || ''}
                    onChange={(e) => setFormData({ ...formData, brand_class: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="35">Classe 35 - Serviços comerciais</option>
                    <option value="41">Classe 41 - Educação e entretenimento</option>
                    <option value="42">Classe 42 - Tecnologia e P&D</option>
                    <option value="43">Classe 43 - Alimentação</option>
                    <option value="25">Classe 25 - Vestuário</option>
                  </select>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    Nossa equipe irá realizar uma busca prévia e orientá-lo sobre o processo.
                  </p>
                </div>
              </>
            )}
          </>
        );

      case 'crm':
        return (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Como pretende captar clientes?
              </label>
              <div className="space-y-2">
                {['Redes Sociais', 'Google Ads', 'Site', 'Indicação', 'WhatsApp', 'Outros'].map((source) => (
                  <label key={source} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.lead_sources?.includes(source) || false}
                      onChange={(e) => {
                        const sources = formData.lead_sources || [];
                        if (e.target.checked) {
                          setFormData({ ...formData, lead_sources: [...sources, source] });
                        } else {
                          setFormData({
                            ...formData,
                            lead_sources: sources.filter((s: string) => s !== source),
                          });
                        }
                      }}
                      className="text-blue-600"
                    />
                    <span className="text-sm text-gray-700">{source}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantos leads espera receber por mês?
              </label>
              <select
                value={formData.expected_leads || ''}
                onChange={(e) => setFormData({ ...formData, expected_leads: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Selecione</option>
                <option value="up_to_10">Até 10 leads</option>
                <option value="10_to_50">10 a 50 leads</option>
                <option value="50_to_100">50 a 100 leads</option>
                <option value="above_100">Mais de 100 leads</option>
              </select>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                Seu CRM já está pronto! Acesse o menu "CRM" para começar a gerenciar seus leads.
              </p>
            </div>
          </>
        );

      default:
        return (
          <div className="text-center py-12 text-gray-600">
            Formulário para {currentStep.label} será implementado aqui
          </div>
        );
    }
  };

  const progress = Math.round(((currentStepIndex + 1) / STEPS.length) * 100);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  const currentStep = STEPS[currentStepIndex];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl p-8 shadow-adw-soft border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-black text-adworks-blue uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">
              PASSO {currentStepIndex + 1} DE {STEPS.length}
            </span>
            <h1 className="text-3xl font-black text-adworks-dark mt-2 tracking-tight">
              {currentStep.label}
            </h1>
            <p className="text-gray-500 mt-1">{currentStep.description}</p>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-1">
              {STEPS.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentStepIndex
                      ? 'w-8 bg-adworks-blue'
                      : idx < currentStepIndex
                      ? 'bg-green-500'
                      : 'bg-gray-200'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-adworks-gray/50 rounded-2xl p-8 border border-dashed border-gray-200">
            {renderStepContent()}
          </div>

          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button
              onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="flex items-center space-x-2 text-gray-400 hover:text-adworks-dark font-bold disabled:opacity-30 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>VOLTAR</span>
            </button>

            <button
              onClick={saveStep}
              className="flex items-center space-x-2 bg-adworks-blue text-white px-8 py-4 rounded-adw font-black hover:bg-blue-700 transition-all shadow-lg shadow-adworks-blue/20 disabled:opacity-50"
            >
              <span>{currentStepIndex === STEPS.length - 1 ? 'FINALIZAR' : 'PRÓXIMO PASSO'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {STEPS.map((step, idx) => {
          const status = stepStatuses[step.key];
          const isActive = idx === currentStepIndex;
          const isCompleted = status === 'APPROVED' || status === 'SUBMITTED';

          return (
            <button
              key={step.key}
              onClick={() => setCurrentStepIndex(idx)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                isActive
                  ? 'border-adworks-blue bg-blue-50 shadow-md translate-y-[-2px]'
                  : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase ${isActive ? 'text-adworks-blue' : 'text-gray-400'}`}>
                  Etapa {idx + 1}
                </span>
                {isCompleted && <CheckCircle className="w-3 h-3 text-green-500" />}
              </div>
              <p className={`text-xs font-bold truncate ${isActive ? 'text-adworks-dark' : 'text-gray-600'}`}>
                {step.label}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
