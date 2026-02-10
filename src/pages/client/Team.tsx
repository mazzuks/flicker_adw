import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2, Crown } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

type Member = {
  id: string;
  user_id: string;
  role: string;
  created_at: string;
  user_email: string;
  user_name: string;
};

export default function Team() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('USER');
  const [currentUserRole, setCurrentUserRole] = useState<string>('');
  const [companyId, setCompanyId] = useState<string>('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadTeamData();
  }, [user]);

  const loadTeamData = async () => {
    if (!user) return;

    try {
      const { data: membership } = await supabase
        .from('company_members')
        .select('company_id, role')
        .eq('user_id', user.id)
        .single();

      if (!membership) return;

      setCompanyId(membership.company_id);
      setCurrentUserRole(membership.role);

      const { data: membersData, error } = await supabase
        .from('company_members')
        .select('id, user_id, role, created_at')
        .eq('company_id', membership.company_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const membersWithDetails = await Promise.all(
        (membersData || []).map(async (member) => {
          const { data: { user: userData } } = await supabase.auth.admin.getUserById(member.user_id);
          return {
            ...member,
            user_email: userData?.email || 'N/A',
            user_name: userData?.user_metadata?.name || 'Sem nome',
          };
        })
      );

      setMembers(membersWithDetails);
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao carregar membros da equipe' });
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const { data: existingUser } = await supabase
        .from('company_members')
        .select('id')
        .eq('company_id', companyId)
        .limit(1)
        .single();

      const { error } = await supabase
        .from('pending_invites')
        .insert({
          company_id: companyId,
          email: inviteEmail.toLowerCase(),
          role: inviteRole,
          invited_by: user?.id,
        });

      if (error) throw error;

      setMessage({ type: 'success', text: `Convite enviado para ${inviteEmail}` });
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('USER');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Erro ao enviar convite' });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (memberId: string, memberEmail: string) => {
    if (!confirm(`Tem certeza que deseja remover ${memberEmail} da equipe?`)) return;

    try {
      const { error } = await supabase
        .from('company_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Membro removido com sucesso' });
      loadTeamData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao remover membro' });
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('company_members')
        .update({ role: newRole })
        .eq('id', memberId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Função atualizada com sucesso' });
      loadTeamData();
    } catch (err: any) {
      setMessage({ type: 'error', text: 'Erro ao atualizar função' });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'OWNER':
        return 'bg-purple-100 text-purple-700';
      case 'ADMIN':
        return 'bg-blue-100 text-blue-700';
      case 'USER':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="w-4 h-4" />;
      case 'ADMIN':
        return <Shield className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const canManageMembers = currentUserRole === 'OWNER' || currentUserRole === 'ADMIN';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Equipe</h1>
          <p className="text-slate-600 mt-1">Gerencie os membros da sua empresa</p>
        </div>
        {canManageMembers && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <UserPlus className="w-4 h-4" />
            Convidar Membro
          </button>
        )}
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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Membro
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Função
                </th>
                <th className="text-left py-3 px-6 text-sm font-semibold text-slate-700">
                  Desde
                </th>
                {canManageMembers && (
                  <th className="text-right py-3 px-6 text-sm font-semibold text-slate-700">
                    Ações
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6">
                    <div>
                      <p className="font-medium text-slate-900">{member.user_name}</p>
                      <p className="text-sm text-slate-600">{member.user_email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {canManageMembers && member.role !== 'OWNER' ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}
                      >
                        <option value="USER">Usuário</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(member.role)}`}>
                        {getRoleIcon(member.role)}
                        {member.role === 'OWNER' ? 'Proprietário' : member.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600">
                    {new Date(member.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  {canManageMembers && (
                    <td className="py-4 px-6 text-right">
                      {member.role !== 'OWNER' && member.user_id !== user?.id && (
                        <button
                          onClick={() => handleRemoveMember(member.id, member.user_email)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-900">Convidar Membro</h2>
            </div>

            <form onSubmit={handleInvite} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="email@exemplo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Função
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USER">Usuário</option>
                  <option value="ADMIN">Admin</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Admin: Pode gerenciar membros e configurações
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteEmail('');
                    setInviteRole('USER');
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar Convite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
