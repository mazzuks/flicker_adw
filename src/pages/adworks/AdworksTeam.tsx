import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Shield, 
  Mail, 
  MoreVertical, 
  Plus, 
  Search, 
  Filter,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface TeamMember {
  id: string;
  email: string;
  full_name: string | null;
  role_global: string;
  created_at: string;
}

export function AdworksTeam() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or('role_global.ilike.ADWORKS_%,role_global.ilike.OPERATOR_%')
      .order('full_name', { ascending: true });

    if (data) setMembers(data);
    setLoading(false);
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      ADWORKS_SUPERADMIN: 'Super Admin',
      ADWORKS_ADMIN: 'Administrador',
      ADWORKS_ACCOUNT_MANAGER: 'Gerente de Contas',
      OPERATOR_ACCOUNTING: 'Operador Contábil',
      OPERATOR_INPI: 'Operador INPI',
    };
    return labels[role] || role;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Equipe Interna
          </h1>
          <p className="text-gray-500 font-medium">Gestão de colaboradores e permissões da Adworks.</p>
        </div>
        <button className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-[2rem] p-8 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/30 transition-all group">
            <div className="flex items-start justify-between mb-6">
              <div className="w-16 h-16 bg-adworks-gray rounded-2xl flex items-center justify-center font-black text-adworks-blue text-xl group-hover:scale-105 transition-transform">
                {member.full_name?.charAt(0) || member.email.charAt(0).toUpperCase()}
              </div>
              <button className="text-gray-300 hover:text-adworks-dark transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            
            <h3 className="text-lg font-black text-adworks-dark uppercase italic tracking-tight mb-1">{member.full_name || 'Sem nome'}</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold mb-6">
               <Mail className="w-3 h-3" />
               {member.email}
            </div>

            <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <Shield className="w-4 h-4 text-adworks-blue" />
                 <span className="text-[10px] font-black text-adworks-dark uppercase tracking-widest">{getRoleLabel(member.role_global)}</span>
               </div>
               <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
