import { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, Trash2, Crown, ChevronRight, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

type Member = {
  id: string;
  user_id: string;
  role_in_client: string;
  created_at: string;
  email: string;
  full_name: string;
};

export default function Team() {
  const { user, currentClientId } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentClientId) {
      loadTeamData();
    }
  }, [currentClientId]);

  const loadTeamData = async () => {
    try {
      const { data, error } = await supabase
        .from('client_memberships')
        .select(`
          id,
          user_id,
          role_in_client,
          created_at,
          user:user_id (
            email,
            full_name
          )
        `)
        .eq('client_id', currentClientId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMembers = (data || []).map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        role_in_client: m.role_in_client,
        created_at: m.created_at,
        email: m.user?.email || 'N/A',
        full_name: m.user?.full_name || 'Sem nome'
      }));

      setMembers(formattedMembers);
    } catch (err: any) {
      console.error('Erro ao carregar equipe:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">Minha Equipe</h1>
          <p className="text-gray-500 font-medium">Colaboradores com acesso ao painel da sua empresa.</p>
        </div>
        <button className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          <span>Convidar Membro</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-adw-soft border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-adworks-gray border-none rounded-2xl focus:ring-2 focus:ring-adworks-blue text-adworks-dark font-bold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-[2rem] p-8 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/30 transition-all group relative overflow-hidden">
            {member.role_in_client === 'CLIENT_OWNER' && (
              <div className="absolute top-0 right-0 bg-adworks-blue text-white px-4 py-1 text-[8px] font-black uppercase tracking-widest rounded-bl-xl shadow-md">
                Proprietário
              </div>
            )}
            
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-adworks-gray rounded-2xl flex items-center justify-center font-black text-adworks-blue text-xl group-hover:scale-105 transition-transform">
                {member.full_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-lg font-black text-adworks-dark uppercase italic tracking-tight">{member.full_name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                   <Mail className="w-3.5 h-3.5" />
                   {member.email}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Shield className="w-4 h-4 text-adworks-blue" />
                 <span className="text-[10px] font-black text-adworks-dark uppercase tracking-widest">
                   {member.role_in_client === 'CLIENT_OWNER' ? 'Dono da Empresa' : 'Colaborador'}
                 </span>
               </div>
               <button className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
