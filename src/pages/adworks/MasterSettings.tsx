import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

export function MasterSettings() {
  const [activeTab, setActiveTab] = useState<'general' | 'keys' | 'plans'>('general');

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">Configurações Master</h1>
        <p className="text-gray-500 font-medium tracking-tight">Gestão de APIs, planos e parâmetros globais do sistema.</p>
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
        <div className="flex-1 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100 min-h-[500px]">
          
          {activeTab === 'general' && (
            <div className="space-y-8">
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
                    <input type="text" defaultValue="Adworks - Empresa Pronta" className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-orange-600 font-bold text-adworks-dark" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail de Suporte (Noreply)</label>
                    <input type="email" defaultValue="noreply@adworks.app" className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-orange-600 font-bold text-adworks-dark" />
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'keys' && (
            <div className="space-y-8">
               <div className="space-y-4">
                  {[
                    { name: 'Cora API Key', status: 'NOT_SET', provider: 'Cora' },
                    { name: 'Registro.br Token', status: 'NOT_SET', provider: 'Registro.br' },
                    { name: 'PagBank Merchant Key', status: 'ACTIVE', provider: 'PagBank' },
                    { name: 'Resend API Key', status: 'ACTIVE', provider: 'Resend' },
                  ].map((key, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-adworks-gray rounded-3xl border border-transparent hover:border-orange-200 transition-all group">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-orange-600 shadow-sm transition-colors">
                             <Database className="w-6 h-6" />
                          </div>
                          <div>
                             <h4 className="font-bold text-adworks-dark text-sm">{key.name}</h4>
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
            <div className="flex flex-col items-center justify-center py-20 opacity-20 italic">
               <CreditCard className="w-16 h-16 mb-4" />
               <p className="font-black text-adworks-dark uppercase tracking-widest">Editor de Planos em breve</p>
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 flex justify-end">
             <button className="bg-adworks-dark text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl active:scale-95">
                Salvar Tudo
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
