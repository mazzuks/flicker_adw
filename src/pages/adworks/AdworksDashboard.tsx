import { 
  Users, 
  Target, 
  TrendingUp, 
  Clock, 
} from 'lucide-react';
import { Card } from '../../components/ui/Card';

export function AdworksDashboard() {
  const stats = [
    { label: 'Empresas Ativas', value: '42', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Conversão Comercial', value: '18%', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Receita Mensal', value: 'R$ 12.4k', icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'SLA Médio', value: '1.2d', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6 border border-slate-100 shadow-sm rounded-2xl flex items-center gap-4">
             <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
             </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
