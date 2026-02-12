import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  Plus,
  Search,
  Mail,
  Phone,
  Tag,
  MoreVertical,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: string | null;
  stage: string;
  tags_json: string[];
  created_at: string;
}

const STAGES = [
  { key: 'NOVO', label: 'Novo', color: 'bg-gray-400' },
  { key: 'CONTATO', label: 'Contato', color: 'bg-adworks-blue' },
  { key: 'QUALIFICADO', label: 'Qualificado', color: 'bg-yellow-400' },
  { key: 'PROPOSTA', label: 'Proposta', color: 'bg-purple-400' },
  { key: 'FECHADO', label: 'Fechado', color: 'bg-green-500' },
  { key: 'PERDIDO', label: 'Perdido', color: 'bg-red-500' },
];

export function CRM() {
  const { currentClientId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentClientId) {
      loadLeads();
    }
  }, [currentClientId]);

  useEffect(() => {
    filterLeads();
  }, [leads, selectedStage, searchTerm]);

  const loadLeads = async () => {
    if (!currentClientId) return;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('client_id', currentClientId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      setLeads(data);
    }
    setLoading(false);
  };

  const filterLeads = () => {
    let filtered = [...leads];

    if (selectedStage) {
      filtered = filtered.filter(lead => lead.stage === selectedStage);
    }

    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone?.includes(searchTerm)
      );
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    const { error } = await supabase
      .from('leads')
      .update({ stage: newStage })
      .eq('id', leadId);

    if (!error) {
      setLeads(leads.map(lead =>
        lead.id === leadId ? { ...lead, stage: newStage } : lead
      ));
    }
  };

  const getLeadsByStage = (stage: string) => {
    return filteredLeads.filter(lead => lead.stage === stage);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            CRM & Vendas
          </h1>
          <p className="text-gray-500 font-medium">Gerencie seus potenciais clientes no estilo Pipedrive.</p>
        </div>
        <button
          onClick={() => setShowNewLeadModal(true)}
          className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-adworks-blue/20 flex items-center gap-2 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Lead</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-[2rem] shadow-adw-soft border border-gray-100 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-adworks-gray border-none rounded-xl focus:ring-2 focus:ring-adworks-blue text-adworks-dark font-medium"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedStage(null)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              !selectedStage ? 'bg-adworks-dark text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
            }`}
          >
            Todos
          </button>
          {STAGES.map(stage => (
            <button
              key={stage.key}
              onClick={() => setSelectedStage(stage.key)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedStage === stage.key ? 'bg-adworks-blue text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto pb-8">
        <div className="flex gap-6 min-w-[1200px]">
          {STAGES.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            return (
              <div key={stage.key} className="flex-1 min-w-[300px] space-y-4 bg-adworks-gray/30 p-4 rounded-[2rem] border border-transparent hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between px-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`}></div>
                    <h3 className="font-black text-adworks-dark uppercase tracking-tighter text-sm italic">{stage.label}</h3>
                  </div>
                  <span className="bg-white px-3 py-1 rounded-full text-[10px] font-black text-gray-400 shadow-sm border border-gray-50">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-4">
                  {stageLeads.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-gray-200 rounded-3xl opacity-50">
                      <p className="text-[10px] font-black text-gray-400 uppercase">Vazio</p>
                    </div>
                  ) : (
                    stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-adworks-blue/20 transition-all group cursor-default"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-black text-adworks-dark tracking-tight leading-tight group-hover:text-adworks-blue transition-colors">
                            {lead.name}
                          </h4>
                          <button className="text-gray-300 hover:text-adworks-dark">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          {lead.email && (
                            <div className="flex items-center text-[11px] text-gray-500 font-medium italic">
                              <Mail className="w-3 h-3 mr-2 text-adworks-blue/50" />
                              <span className="truncate">{lead.email}</span>
                            </div>
                          )}
                          {lead.phone && (
                            <div className="flex items-center text-[11px] text-gray-500 font-medium">
                              <Phone className="w-3 h-3 mr-2 text-adworks-blue/50" />
                              {lead.phone}
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                           <div className="flex gap-1">
                             {lead.tags_json?.slice(0, 2).map((tag, i) => (
                               <span key={i} className="text-[9px] font-black bg-adworks-gray text-gray-400 px-2 py-0.5 rounded-full uppercase">
                                 {tag}
                               </span>
                             ))}
                           </div>
                           <button 
                            onClick={() => {
                              const nextIdx = STAGES.findIndex(s => s.key === lead.stage) + 1;
                              if (nextIdx < STAGES.length) updateLeadStage(lead.id, STAGES[nextIdx].key);
                            }}
                            className="w-8 h-8 rounded-xl bg-adworks-gray text-gray-400 hover:bg-adworks-blue hover:text-white transition-all flex items-center justify-center"
                           >
                             <ArrowRight className="w-4 h-4" />
                           </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
