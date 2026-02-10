import { useState, useEffect } from 'react';
import { User, Lock, Building2, Bell, Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

export default function Account() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [companyData, setCompanyData] = useState<any>(null);
  const [notifications, setNotifications] = useState({
    email_tasks: true,
    email_messages: true,
    email_updates: true,
  });

  useEffect(() => {
    loadUserData();
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;

    setProfileData({
      name: user.user_metadata?.name || '',
      email: user.email || '',
    });

    const { data: membership } = await supabase
      .from('company_members')
      .select('company:companies(*)')
      .eq('user_id', user.id)
      .single();

    if (membership?.company) {
      setCompanyData(membership.company);
    }

    const { data: prefs } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (prefs) {
      setNotifications({
        email_tasks: prefs.email_tasks ?? true,
        email_messages: prefs.email_messages ?? true,
        email_updates: prefs.email_updates ?? true,
      });
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { error } = await supabase.auth.updateUser({
        data: { name: profileData.name }
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao atualizar perfil' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      setLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A senha deve ter no mínimo 6 caracteres' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao alterar senha' });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async (key: string, value: boolean) => {
    if (!user) return;

    setNotifications(prev => ({ ...prev, [key]: value }));

    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          [key]: value,
        });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Preferências atualizadas!' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao atualizar preferências' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Minha Conta</h1>
        <p className="text-slate-600 mt-1">Gerencie suas informações pessoais e preferências</p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Informações Pessoais</h2>
            <p className="text-sm text-slate-600">Atualize seus dados pessoais</p>
          </div>
        </div>

        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profileData.email}
              disabled
              className="w-full px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">O email não pode ser alterado</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <Lock className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Alterar Senha</h2>
            <p className="text-sm text-slate-600">Mantenha sua conta segura</p>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nova Senha
            </label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Confirmar Nova Senha
            </label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite a senha novamente"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            <Lock className="w-4 h-4" />
            {loading ? 'Alterando...' : 'Alterar Senha'}
          </button>
        </form>
      </div>

      {companyData && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Dados da Empresa</h2>
              <p className="text-sm text-slate-600">Informações da sua empresa</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Razão Social
              </label>
              <p className="text-slate-900">{companyData.legal_name}</p>
            </div>

            {companyData.cnpj && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  CNPJ
                </label>
                <p className="text-slate-900">{companyData.cnpj}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Telefone
              </label>
              <p className="text-slate-900">{companyData.phone}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <p className="text-slate-900">{companyData.email}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Notificações</h2>
            <p className="text-sm text-slate-600">Escolha como deseja receber notificações</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Tarefas</p>
              <p className="text-sm text-slate-600">Receber emails sobre novas tarefas</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email_tasks}
              onChange={(e) => handleNotificationUpdate('email_tasks', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Mensagens</p>
              <p className="text-sm text-slate-600">Receber emails sobre novas mensagens</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email_messages}
              onChange={(e) => handleNotificationUpdate('email_messages', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer">
            <div>
              <p className="font-medium text-slate-900">Atualizações</p>
              <p className="text-sm text-slate-600">Receber emails sobre atualizações importantes</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.email_updates}
              onChange={(e) => handleNotificationUpdate('email_updates', e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
