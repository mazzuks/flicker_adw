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
  CheckCircle,
  MessageSquare,
  Paperclip,
  Clock,
  ExternalLink
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
  { key: 'NOVO', label: 'Idea', color: 'border-t-4 border-t-gray-400' },
  { key: 'CONTATO', label: 'Contactado', color: 'border-t-4 border-t-adworks-blue' },
  { key: 'QUALIFICADO', label: 'Necessidades', color: 'border-t-4 border-t-yellow-400' },
  { key: 'PROPOSTA', label: 'Proposta', color: 'border-t-4 border-t-purple-400' },
  { key: 'FECHADO', label: 'Negociação', color: 'border-t-4 border-t-green-500' },
];

export function CRM() {
  const { currentClientId } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    if (selectedStage) filtered = filtered.filter(lead => lead.stage === selectedStage);
    if (searchTerm) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredLeads(filtered);
  };

  const updateLeadStage = async (leadId: string, newStage: string) => {
    const { error } = await supabase.from('leads').update({ stage: newStage }).eq('id', leadId);
    if (!error) loadLeads();
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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Sales Board
          </h1>
          <p className="text-gray-500 font-medium">Pipeline de vendas inspirado no Pipedrive.</p>
        </div>
        <button className="bg-adworks-blue text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 active:scale-95">
          <Plus className="w-5 h-5" />
          <span>Novo Negócio</span>
        </button>
      </div>

      {/* SEARCH BAR (Trello Style) */}
      <div className="bg-white p-4 rounded-[2rem] shadow-adw-soft border border-gray-100">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input
            type="text"
            placeholder="Filtrar negócios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-adworks-gray border-none rounded-xl text-xs font-bold text-adworks-dark outline-none focus:ring-1 focus:ring-adworks-blue"
          />
        </div>
      </div>

      <div className="overflow-x-auto pb-12 h-[calc(100vh-320px)] scrollbar-hide">
        <div className="flex gap-6 h-full min-w-[1400px]">
          {STAGES.map((stage) => {
            const stageLeads = getLeadsByStage(stage.key);
            const totalValue = stageLeads.length * 2000; // Mock de valor

            return (
              <div key={stage.key} className="flex-1 min-w-[300px] flex flex-col bg-adworks-gray/30 rounded-[2.5rem] p-4 border border-transparent hover:border-gray-200 transition-colors">
                <div className={`p-6 bg-white rounded-t-3xl shadow-sm mb-4 ${stage.color}`}>
                   <div className="flex items-center justify-between">
                      <h3 className="font-black text-adworks-dark uppercase tracking-tight text-xs italic">{stage.label}</h3>
                      <span className="bg-adworks-gray px-2 py-1 rounded-lg text-[9px] font-black text-gray-400 border border-gray-100">{stageLeads.length}</span>
                   </div>
                   <p className="text-sm font-black text-adworks-blue mt-2 tracking-tighter">R$ {totalValue.toLocaleString()}</p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('leadId', lead.id)}
                      className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-adworks-blue/20 transition-all group cursor-grab active:cursor-grabbing relative overflow-hidden"
                    >
                      {/* CARD COVER MOCK */}
                      <div className="h-1 bg-adworks-gray absolute top-0 left-0 right-0"></div>

                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-adworks-dark tracking-tight leading-tight group-hover:text-adworks-blue transition-colors text-sm">
                          {lead.name}
                        </h4>
                        <button className="text-gray-300 hover:text-adworks-dark">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="space-y-1.5">
                         <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">Negócio Indra Sistemas</p>
                         <p className="text-xs font-black text-adworks-dark tracking-tight">R$ 2.000,00</p>
                      </div>

                      <div className="mt-6 flex items-center justify-between">
                         <div className="flex gap-2">
                            <div className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase">
                               <MessageSquare className="w-3 h-3" /> 1
                            </div>
                            <div className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase">
                               <Paperclip className="w-3 h-3" /> 2
                            </div>
                         </div>
                         
                         <div className="flex items-center gap-2">
                           {lead.tags_json?.slice(0, 1).map((tag, i) => (
                             <span key={i} className="text-[8px] font-black bg-blue-50 text-adworks-blue px-2 py-0.5 rounded-full border border-blue-100 uppercase">
                               {tag}
                             </span>
                           ))}
                           <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center">
                              <Clock className="w-3 h-3 text-orange-600" />
                           </div>
                         </div>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-4 border-2 border-dashed border-gray-200 rounded-3xl text-[10px] font-black text-gray-300 uppercase tracking-widest hover:border-adworks-blue hover:text-adworks-blue transition-all">
                    + Adicionar Negócio
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
