import { useState, useEffect } from 'react';
import { User, Lock, Building2, Bell, Save, CreditCard, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function Account() {
  const { user, currentClientId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'profile' | 'subscription' | 'notifications'>('profile');

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  useEffect(() => {
    if (currentClientId) {
      loadSubscriptionData();
    }
  }, [currentClientId]);

  const loadUserData = async () => {
    setProfileData({
      name: user?.user_metadata?.full_name || '',
      email: user?.email || '',
    });
  };

  const loadSubscriptionData = async () => {
    const { data } = await supabase
      .from('subscriptions')
      .select('*, plan:plans(*)')
      .eq('client_id', currentClientId)
      .maybeSingle();
    
    if (data) setSubscription(data);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('user_profiles').update({
      full_name: profileData.name
    }).eq('id', user?.id);

    if (!error) setMessage({ type: 'success', text: 'Perfil atualizado!' });
    else setMessage({ type: 'error', text: 'Erro ao atualizar.' });
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">Minha Conta</h1>
        <p className="text-gray-500 font-medium">Gerencie seu perfil e sua assinatura Adworks.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {[
            { id: 'profile', label: 'Meu Perfil', icon: User },
            { id: 'subscription', label: 'Assinatura', icon: CreditCard },
            { id: 'notifications', label: 'Notificações', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                activeTab === tab.id 
                ? 'bg-adworks-blue text-white shadow-lg shadow-adworks-blue/20' 
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
          {message.text && (
            <div className={`mb-8 p-4 rounded-2xl text-sm font-bold ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Nome Completo</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">E-mail (Login)</label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-adworks-blue text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-adworks-blue/20"
              >
                Salvar Alterações
              </button>
            </form>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-8">
              <div className="bg-adworks-dark p-8 rounded-3xl text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-adworks-blue/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-adworks-blue/30 transition-all"></div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Plano Atual</p>
                <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4">{subscription?.plan?.name || 'Carregando...'}</h3>
                <div className="flex items-center gap-2 text-adworks-accent font-bold">
                  <span className="text-sm">R$ {subscription?.plan?.price || '0,00'}</span>
                  <span className="text-[10px] text-gray-500 uppercase">/mês</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button className="p-6 bg-adworks-gray hover:bg-gray-100 rounded-2xl border border-transparent transition-all text-left group">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Método de Pagamento</p>
                   <p className="font-bold text-adworks-dark group-hover:text-adworks-blue transition-colors">PIX (Padrão)</p>
                 </button>
                 <button className="p-6 bg-adworks-gray hover:bg-gray-100 rounded-2xl border border-transparent transition-all text-left group">
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Vencimento</p>
                   <p className="font-bold text-adworks-dark group-hover:text-adworks-blue transition-colors">Todo dia 10</p>
                 </button>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <button className="text-red-500 font-black text-xs uppercase tracking-widest hover:underline">Cancelar Assinatura</button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6 italic text-gray-400 font-medium">
              Preferências de notificação em breve...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
