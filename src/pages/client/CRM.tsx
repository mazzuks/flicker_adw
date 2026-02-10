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
  { key: 'NOVO', label: 'Novo', color: 'bg-gray-100 text-gray-700' },
  { key: 'CONTATO', label: 'Contato', color: 'bg-blue-100 text-blue-700' },
  { key: 'QUALIFICADO', label: 'Qualificado', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'PROPOSTA', label: 'Proposta', color: 'bg-purple-100 text-purple-700' },
  { key: 'FECHADO', label: 'Fechado', color: 'bg-green-100 text-green-700' },
  { key: 'PERDIDO', label: 'Perdido', color: 'bg-red-100 text-red-700' },
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM</h1>
          <p className="text-gray-600 mt-1">Gerencie seus leads e clientes</p>
        </div>
        <button
          onClick={() => setShowNewLeadModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Novo Lead</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar leads..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedStage(null)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                !selectedStage ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {STAGES.map(stage => (
              <button
                key={stage.key}
                onClick={() => setSelectedStage(stage.key)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedStage === stage.key ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {stage.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {STAGES.map(stage => {
            const stageLeads = getLeadsByStage(stage.key);
            return (
              <div key={stage.key} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {stageLeads.map(lead => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('leadId', lead.id);
                        e.dataTransfer.setData('currentStage', lead.stage);
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{lead.name}</h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {lead.email && (
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{lead.email}</span>
                        </div>
                      )}

                      {lead.phone && (
                        <div className="flex items-center space-x-2 text-xs text-gray-600 mb-2">
                          <Phone className="w-3 h-3" />
                          <span>{lead.phone}</span>
                        </div>
                      )}

                      {lead.source && (
                        <div className="flex items-center space-x-1 mt-2">
                          <Tag className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{lead.source}</span>
                        </div>
                      )}
                    </div>
                  ))}

                  {stageLeads.length === 0 && (
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-400 text-sm"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const leadId = e.dataTransfer.getData('leadId');
                        const currentStage = e.dataTransfer.getData('currentStage');
                        if (currentStage !== stage.key) {
                          updateLeadStage(leadId, stage.key);
                        }
                      }}
                    >
                      Arraste leads aqui
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Resumo</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Total de leads</span>
              <span className="font-bold text-gray-900">{leads.length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Novos (últimos 7 dias)</span>
              <span className="font-bold text-blue-600">
                {leads.filter(l => {
                  const daysDiff = (Date.now() - new Date(l.created_at).getTime()) / (1000 * 60 * 60 * 24);
                  return daysDiff <= 7;
                }).length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Taxa de conversão</span>
              <span className="font-bold text-green-600">
                {leads.length > 0 ? Math.round((getLeadsByStage('FECHADO').length / leads.length) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Atividade recente</h3>
          <div className="space-y-3">
            {leads.slice(0, 5).map((lead) => (
              <div key={lead.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{lead.name}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  STAGES.find(s => s.key === lead.stage)?.color
                }`}>
                  {STAGES.find(s => s.key === lead.stage)?.label}
                </span>
              </div>
            ))}
            {leads.length === 0 && (
              <p className="text-center text-gray-600 py-8">Nenhum lead cadastrado ainda</p>
            )}
          </div>
        </div>
      </div>

      {showNewLeadModal && (
        <NewLeadModal
          onClose={() => setShowNewLeadModal(false)}
          onSave={loadLeads}
          clientId={currentClientId!}
        />
      )}
    </div>
  );
}

interface NewLeadModalProps {
  onClose: () => void;
  onSave: () => void;
  clientId: string;
}

function NewLeadModal({ onClose, onSave, clientId }: NewLeadModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.from('leads').insert({
      client_id: clientId,
      name: formData.name,
      email: formData.email || null,
      phone: formData.phone || null,
      source: formData.source || null,
      stage: 'NOVO',
      tags_json: [],
    });

    if (!error) {
      onSave();
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Novo Lead</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Origem
            </label>
            <input
              type="text"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              placeholder="Ex: Site, indicação, redes sociais"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
