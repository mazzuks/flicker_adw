import { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Building2,
  Bell,
  Save,
  CreditCard,
  ChevronRight,
  Mail,
  Phone,
  Camera,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function Account() {
  const { user, profile, currentClientId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<
    'profile' | 'security' | 'subscription' | 'notifications'
  >('profile');

  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    avatar_url: '',
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: (profile as any).phone || '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);

  useEffect(() => {
    if (currentClientId) {
      loadSubscriptionData();
    }
  }, [currentClientId]);

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
    setMessage({ type: '', text: '' });

    const { error } = await supabase
      .from('user_profiles')
      .update({
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
      })
      .eq('id', user?.id);

    if (!error) {
      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } else {
      setMessage({ type: 'error', text: 'Erro ao atualizar o perfil.' });
    }
    setLoading(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: passwordData.newPassword,
    });

    if (!error) {
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordData({ newPassword: '', confirmPassword: '' });
    } else {
      setMessage({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
          Minha Conta
        </h1>
        <p className="text-gray-500 font-medium">
          Gerencie suas informações pessoais e configurações.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-72 space-y-2">
          {[
            { id: 'profile', label: 'Dados Pessoais', icon: User },
            { id: 'security', label: 'Segurança', icon: Lock },
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
              <ChevronRight
                className={`w-4 h-4 transition-transform ${activeTab === tab.id ? 'rotate-90' : ''}`}
              />
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white rounded-[2.5rem] p-10 shadow-adw-soft border border-gray-100 min-h-[550px] relative">
          {message.text && (
            <div
              className={`mb-8 p-5 rounded-2xl text-sm font-black uppercase tracking-tight flex items-center gap-3 animate-in slide-in-from-top-2 ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
            >
              {message.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-10">
              <div className="flex items-center gap-8 pb-10 border-b border-gray-50">
                <div className="relative group">
                  <div className="w-24 h-24 bg-adworks-gray rounded-[2rem] flex items-center justify-center font-black text-3xl text-adworks-blue shadow-inner border border-gray-100">
                    {profileData.full_name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue transition-all">
                    <Camera className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-adworks-dark uppercase italic leading-tight">
                    {profileData.full_name || 'Seu Nome'}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {profileData.email}
                  </p>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, full_name: e.target.value })
                        }
                        className="w-full pl-12 pr-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                        placeholder="Seu nome"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Telefone / WhatsApp
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        type="text"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="w-full pl-12 pr-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-adworks-blue text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.15em] hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
                  >
                    ATUALIZAR PERFIL
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-8">
              <div className="p-6 bg-orange-50 border border-orange-100 rounded-3xl flex gap-4">
                <Lock className="w-6 h-6 text-orange-500 shrink-0" />
                <div>
                  <p className="text-sm font-black text-orange-700 uppercase tracking-tighter mb-1">
                    Dica de Segurança
                  </p>
                  <p className="text-xs font-medium text-orange-600 leading-relaxed">
                    Use uma senha forte com letras, números e símbolos para proteger os dados da sua
                    empresa.
                  </p>
                </div>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Nova Senha
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">
                      Confirmar Nova Senha
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                      }
                      className="w-full px-6 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue font-bold text-adworks-dark"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-adworks-dark text-white px-10 py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.15em] hover:bg-adworks-blue transition-all shadow-xl active:scale-95"
                >
                  ALTERAR SENHA
                </button>
              </form>
            </div>
          )}

          {activeTab === 'subscription' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
              <div className="bg-adworks-dark p-10 rounded-[2rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-adworks-blue/20 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-adworks-blue/40 transition-all duration-700"></div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">
                  Plano de Serviço Ativo
                </p>
                <h3 className="text-5xl font-black italic uppercase tracking-tighter mb-6">
                  {subscription?.plan?.name || 'ADWORKS BASIC'}
                </h3>
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                    <span className="text-xl font-black italic">
                      R$ {subscription?.plan?.price || '197,00'}
                    </span>
                    <span className="text-[10px] text-gray-400 uppercase ml-2">/mês</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-400 font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                    CONTA PROTEGIDA
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-adworks-gray rounded-2xl border border-transparent flex justify-between items-center group cursor-pointer hover:bg-white hover:border-adworks-blue/20 transition-all">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Método
                    </p>
                    <p className="font-black text-adworks-dark group-hover:text-adworks-blue transition-colors uppercase italic">
                      PIX Recorrente
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
                <div className="p-6 bg-adworks-gray rounded-2xl border border-transparent flex justify-between items-center group cursor-pointer hover:bg-white hover:border-adworks-blue/20 transition-all">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                      Próximo Vencimento
                    </p>
                    <p className="font-black text-adworks-dark group-hover:text-adworks-blue transition-colors uppercase italic">
                      10 MAR 2026
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-20 opacity-30">
              <Bell className="w-16 h-16 text-gray-300" />
              <p className="font-black text-adworks-dark uppercase italic tracking-tighter">
                Configurações de Alerta em breve
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Icons support
function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}
