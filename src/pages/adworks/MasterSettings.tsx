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
  CheckCircle2
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
      features_json: Array.isArray(editingPlan.features_json) ? editingPlan.features_json : []
    });

    if (!error) {
      setEditingPlan(null);
      loadPlans();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic leading-none">Configurações Master</h1>
        <p className="text-gray-500 font-medium tracking-tight mt-2">Gestão de APIs, planos e parâmetros globais do sistema.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 space-y-2">
          {[
            { id: 'general', label: 'Geral', icon: Settings },
            { id: 'keys', label: 'Chaves de API', icon: Key },
            { id: 'plans', label: 'Planos & Preços', icon: CreditCard },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'bg-white text-gray-400 hover:text-adworks-dark border border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`} />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100 min-h-[550px] relative overflow-hidden">
          
          {activeTab === 'general' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex gap-4">
                  <Shield className="w-6 h-6 text-orange-600 shrink-0" />
                  <div>
                    <p className="text-xs font-black text-orange-700 uppercase tracking-widest mb-1">Acesso Restrito</p>
                    <p className="text-sm font-medium text-orange-600">Estas configurações afetam todos os usuários da plataforma.</p>
                  </div>
               </div>

               <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome da Plataforma</label>
                    <input type="text" defaultValue="Adworks - Empresa Pronta" className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-orange-600 font-bold text-adworks-dark outline-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail de Suporte (Noreply)</label>
                    <input type="email" defaultValue="noreply@adworks.app" className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-orange-600 font-bold text-adworks-dark outline-none" />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="space-y-4">
                  {[
                    { name: 'Cora API Key', status: 'NOT_SET', provider: 'Cora' },
                    { name: 'Registro.br Token', status: 'NOT_SET', provider: 'Registro.br' },
                    { name: 'PagBank Merchant Key', status: 'ACTIVE', provider: 'PagBank' },
                    { name: 'Mercado Pago Token', status: 'NOT_SET', provider: 'Mercado Pago' },
                  ].map((key, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-adworks-gray rounded-3xl border border-transparent hover:border-orange-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-600 shadow-sm transition-colors">
                             <Database className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-adworks-dark text-sm leading-tight italic uppercase">{key.name}</h4>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{key.provider}</p>
                          </div>
                       </div>
                       <button className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${key.status === 'ACTIVE' ? 'border-green-100 text-green-600 bg-green-50' : 'border-red-100 text-red-400 bg-red-50'}`}>
                          {key.status === 'ACTIVE' ? 'Configurado' : 'Pendente'}
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-adworks-dark uppercase italic tracking-tighter">Editor de Planos</h3>
                  <button 
                    onClick={() => setEditingPlan({ name: '', price: 0, interval: 'month', features_json: [], is_active: true })}
                    className="p-2.5 bg-adworks-dark text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
               </div>

               {editingPlan ? (
                 <div className="bg-adworks-gray/50 p-8 rounded-3xl border-2 border-dashed border-orange-200 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Nome do Plano</label>
                          <input 
                            type="text" 
                            value={editingPlan.name} 
                            onChange={e => setEditingPlan({...editingPlan, name: e.target.value})}
                            className="w-full px-5 py-3 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-orange-500" 
                            placeholder="Ex: Premium Gold" 
                          />
                       </div>
                       <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 ml-1">Preço Mensal (R$)</label>
                          <input 
                            type="number" 
                            value={editingPlan.price} 
                            onChange={e => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                            className="w-full px-5 py-3 rounded-xl border-none font-bold text-sm focus:ring-2 focus:ring-orange-500" 
                          />
                       </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                       <button onClick={() => setEditingPlan(null)} className="px-6 py-2.5 text-xs font-black uppercase text-gray-400">Cancelar</button>
                       <button onClick={handleSavePlan} className="px-8 py-2.5 bg-orange-600 text-white rounded-xl text-xs font-black uppercase shadow-lg shadow-orange-500/20">Salvar Plano</button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {plans.map((plan) => (
                      <div key={plan.id} className="p-6 bg-adworks-gray rounded-3xl flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-orange-100">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-orange-600 shadow-sm font-black text-lg">
                               {plan.name.charAt(0)}
                            </div>
                            <div>
                               <h4 className="font-black text-adworks-dark uppercase italic tracking-tight">{plan.name}</h4>
                               <p className="text-sm font-black text-orange-600 tracking-tighter">R$ {plan.price.toFixed(2)} <span className="text-[10px] text-gray-400 font-bold">/ MÊS</span></p>
                            </div>
                         </div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <button onClick={() => setEditingPlan(plan)} className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue"><Edit3 className="w-4 h-4" /></button>
                            <button className="w-9 h-9 rounded-lg bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                         </div>
                      </div>
                    ))}
                    {plans.length === 0 && !loading && (
                      <div className="py-20 text-center opacity-30 italic text-sm font-bold uppercase tracking-widest">Nenhum plano cadastrado</div>
                    )}
                 </div>
               )}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
             <button className="bg-adworks-dark text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-2xl active:scale-95 flex items-center gap-3">
                <Save className="w-5 h-5" />
                <span>Salvar Tudo</span>
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
