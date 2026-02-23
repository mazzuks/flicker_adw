import { useDealsBoard } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { 
  Building2, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ChevronRight, 
  ArrowUpDown
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

/**
 * 🏢 COMPANIES LIST (Enterprise Grade)
 * Tabela detalhada com filtros e busca para gestão de volume.
 * Estética: Pipedrive / Salesforce Lightning.
 */

export function Companies() {
  const { data: deals, isLoading } = useDealsBoard();
  const { openDeal } = useUIStore();

  if (isLoading) return <div className="p-10 animate-pulse font-black text-slate-300">SYNCING COMPANIES...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* HEADER & FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Base de Empresas</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total de {deals?.length || 0} registros ativos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por CNPJ ou Nome..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
            />
          </div>
          <Button variant="secondary" className="gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button variant="primary" className="bg-blue-600 shadow-lg shadow-blue-200">
            Nova Empresa
          </Button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="flex items-center gap-2 cursor-pointer hover:text-slate-600">
                  Empresa / CNPJ <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Etapa Atual</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">SLA Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Responsável</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {deals?.map((deal: any) => (
              <tr 
                key={deal.id} 
                className="hover:bg-slate-50/80 transition-all group cursor-pointer"
                onClick={() => openDeal(deal.id)}
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100 shadow-sm group-hover:scale-110 transition-all">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 tracking-tight">{deal.company_name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{deal.company_cnpj || '00.000.000/0001-00'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{deal.stage_key}</span>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex justify-center">
                      <Badge variant={deal.sla_status}>
                        {deal.sla_status === 'breached' ? 'ATRASADO' : deal.sla_status === 'warning' ? 'VENCE 24H' : 'EM DIA'}
                      </Badge>
                   </div>
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
                         <span className="text-[8px] font-black text-slate-400">DM</span>
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Dan M.</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Ver Detalhes">
                         <ChevronRight className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all" title="Mais opções">
                         <MoreHorizontal className="w-5 h-5" />
                      </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Mostrando {deals?.length || 0} de {deals?.length || 0} empresas</p>
           <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" className="px-4 opacity-50 cursor-not-allowed">Anterior</Button>
              <Button size="sm" variant="secondary" className="px-4 opacity-50 cursor-not-allowed">Próxima</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
