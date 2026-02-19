import { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  Globe,
  CreditCard,
  Bell,
  Shield,
  Save,
  Zap,
  ChevronRight,
  Database,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  features_json: string[];
  is_active: boolean;
}

export function MasterSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'keys' | 'plans'>('general');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Partial<Plan> | null>(null);

  useEffect(() => {
    if (activeTab === 'plans') {
      loadPlans();
    }
  }, [activeTab]);

  const loadPlans = async () => {
    setLoading(true);
    const { data } = await supabase.from('plans').select('*').order('price', { ascending: true });
    if (data) setPlans(data);
    setLoading(false);
  };

  const handleSavePlan = async () => {
    if (!editingPlan?.name) return;

    setLoading(true);
    const { error } = await supabase.from('plans').upsert({
      ...editingPlan,
      features_json: Array.isArray(editingPlan.features_json) ? editingPlan.features_json : [],
    });

    if (!error) {
      setEditingPlan(null);
      loadPlans();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-none">
            CONFIGURAÇÕES MASTER
          </h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-3">
            Gestão de APIs, planos e parâmetros globais do sistema.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs (Pipedrive Style) */}
        <div className="w-full md:w-72 space-y-1">
          {[
            { id: 'general', label: 'GERAL', icon: Settings },
            { id: 'keys', label: 'CHAVES DE API', icon: Key },
            { id: 'plans', label: 'PLANOS & PREÇOS', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-xl font-black text-[10px] tracking-[0.1em] transition-all group ${
                activeTab === tab.id
                  ? 'bg-[#3D5266] text-white shadow-lg'
                  : 'text-gray-400 hover:text-[#2D3E50] hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon
                  className={`w-4 h-4 ${activeTab === tab.id ? 'text-adworks-blue' : 'text-gray-300 group-hover:text-gray-400'}`}
                />
                {tab.label}
              </div>
              <ChevronRight
                className={`w-3 h-3 transition-transform ${activeTab === tab.id ? 'rotate-90 opacity-100' : 'opacity-0'}`}
              />
            </button>
          ))}
        </div>

        {/* Content Area (Clean Board Style) */}
        <div className="flex-1 bg-white rounded-3xl p-10 shadow-sm border border-gray-100 min-h-[550px] relative overflow-hidden">
          {activeTab === 'general' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-[#FFF7ED] border border-[#FFEDD5] p-6 rounded-2xl flex gap-4">
                <Shield className="w-6 h-6 text-[#F97316] shrink-0" />
                <div>
                  <p className="text-[10px] font-black text-[#9A3412] uppercase tracking-widest mb-1 italic">
                    ACESSO RESTRITO
                  </p>
                  <p className="text-xs font-bold text-[#C2410C]">
                    Estas configurações afetam todos os usuários da plataforma.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    NOME DA PLATAFORMA
                  </label>
                  <input
                    type="text"
                    defaultValue="Adworks - Empresa Pronta"
                    className="w-full px-6 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-adworks-blue font-bold text-[#2D3E50] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
                    E-MAIL DE SUPORTE (NOREPLY)
                  </label>
                  <input
                    type="email"
                    defaultValue="noreply@adworks.app"
                    className="w-full px-6 py-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-adworks-blue font-bold text-[#2D3E50] outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-3">
                {[
                  { name: 'Cora API Key', status: 'NOT_SET', provider: 'Cora' },
                  { name: 'Registro.br Token', status: 'NOT_SET', provider: 'Registro.br' },
                  { name: 'PagBank Merchant Key', status: 'ACTIVE', provider: 'PagBank' },
                  { name: 'Mercado Pago Token', status: 'NOT_SET', provider: 'Mercado Pago' },
                ].map((key, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-6 bg-[#F8FAFC] rounded-2xl border border-transparent hover:border-[#E2E8F0] transition-all group"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-300 group-hover:text-adworks-blue shadow-sm border border-gray-50 transition-colors">
                        <Database className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-[#2D3E50] text-sm italic uppercase tracking-tight">
                          {key.name}
                        </h4>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-0.5">
                          {key.provider}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${key.status === 'ACTIVE' ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-400 bg-red-50'}`}
                    >
                      {key.status === 'ACTIVE' ? 'CONFIGURADO' : 'PENDENTE'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black text-[#2D3E50] uppercase italic tracking-tighter leading-none">
                  Editor de Planos
                </h3>
                <button
                  onClick={() =>
                    setEditingPlan({
                      name: '',
                      price: 0,
                      interval: 'month',
                      features_json: [],
                      is_active: true,
                    })
                  }
                  className="p-3 bg-[#2D3E50] text-white rounded-xl hover:bg-adworks-blue transition-all shadow-lg active:scale-95 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest pr-1">
                    Novo Plano
                  </span>
                </button>
              </div>

              {editingPlan ? (
                <div className="bg-[#F8FAFC] p-8 rounded-3xl border-2 border-dashed border-[#E2E8F0] space-y-8 animate-in zoom-in-95 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-3 ml-1 tracking-widest">
                        NOME DO PLANO
                      </label>
                      <input
                        type="text"
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                        className="w-full px-5 py-4 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#2D3E50] focus:ring-2 focus:ring-adworks-blue outline-none"
                        placeholder="Ex: Premium Gold"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-gray-400 uppercase mb-3 ml-1 tracking-widest">
                        PREÇO MENSAL (R$)
                      </label>
                      <input
                        type="number"
                        value={editingPlan.price}
                        onChange={(e) =>
                          setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })
                        }
                        className="w-full px-5 py-4 rounded-xl border border-[#E2E8F0] font-bold text-sm text-[#2D3E50] focus:ring-2 focus:ring-adworks-blue outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => setEditingPlan(null)}
                      className="px-6 py-3 text-[10px] font-black uppercase text-gray-400 tracking-widest"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSavePlan}
                      className="px-10 py-3 bg-adworks-blue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      Salvar Plano
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div
                      key={plan.id}
                      className="p-6 bg-[#F8FAFC] rounded-2xl flex items-center justify-between group hover:bg-white hover:shadow-2xl transition-all border border-transparent hover:border-[#E2E8F0]"
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-adworks-blue shadow-sm border border-gray-50 font-black text-lg">
                          {plan.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-black text-[#2D3E50] uppercase italic tracking-tight">
                            {plan.name}
                          </h4>
                          <p className="text-base font-black text-adworks-blue tracking-tighter">
                            R$ {plan.price.toFixed(2)}{' '}
                            <span className="text-[9px] text-gray-400 font-bold uppercase ml-1">
                              / Mês
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                          onClick={() => setEditingPlan(plan)}
                          className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue hover:shadow-md"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:shadow-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {plans.length === 0 && !loading && (
                    <div className="py-20 text-center opacity-20 italic font-black text-[#2D3E50] uppercase tracking-[0.3em]">
                      Nenhum plano cadastrado
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-gray-50 flex justify-end">
            <button className="bg-[#2D3E50] text-white px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] hover:bg-adworks-blue transition-all shadow-2xl active:scale-95 flex items-center gap-4">
              <Save className="w-5 h-5" />
              <span>SALVAR TUDO</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
