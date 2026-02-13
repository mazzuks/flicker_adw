import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  User, 
  Building2, 
  ArrowRight, 
  Filter,
  Search,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';

interface OperatorTask {
  id: string;
  type: 'TICKET_CNPJ' | 'TICKET_INPI' | 'TICKET_FISCAL' | 'DOCUMENT_VALIDATION';
  title: string;
  client_name: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: string;
  created_at: string;
  sla_due_at: string | null;
}

export function AdworksTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOperatorTasks();
  }, []);

  const loadOperatorTasks = async () => {
    setLoading(true);
    
    // 1. Buscar Tickets que precisam de ação
    const { data: tickets } = await supabase
      .from('tickets')
      .select('*, client:clients(name)')
      .in('status', ['NEW', 'READY', 'IN_PROGRESS', 'WAITING_CLIENT'])
      .order('priority', { ascending: false });

    // 2. Buscar Documentos que aguardam validação
    const { data: docs } = await supabase
      .from('documents')
      .select('*, client:clients(name)')
      .eq('status', 'RECEIVED');

    const formattedTasks: OperatorTask[] = [];

    tickets?.forEach(t => {
      formattedTasks.push({
        id: t.id,
        type: t.type,
        title: `Processar ${t.type.replace('TICKET_', '')}`,
        client_name: t.client?.name || 'N/A',
        priority: t.priority,
        status: t.status,
        created_at: t.created_at,
        sla_due_at: t.sla_due_at
      });
    });

    docs?.forEach(d => {
      formattedTasks.push({
        id: d.id,
        type: 'DOCUMENT_VALIDATION',
        title: `Validar: ${d.category}`,
        client_name: d.client?.name || 'N/A',
        priority: 'NORMAL',
        status: 'RECEIVED',
        created_at: d.created_at,
        sla_due_at: null
      });
    });

    setTasks(formattedTasks);
    setLoading(false);
  };

  const handleAttendTask = (task: OperatorTask) => {
    const isOperator = window.location.pathname.startsWith('/operator');
    const basePath = isOperator ? '/operator' : '/master';

    // Roteamento inteligente baseado no tipo da tarefa
    switch (task.type) {
      case 'TICKET_CNPJ':
        navigate(`${basePath}/tickets/cnpj`);
        break;
      case 'TICKET_INPI':
        navigate(`${basePath}/tickets/inpi`);
        break;
      case 'TICKET_FISCAL':
        navigate(`${basePath}/tickets/fiscal`);
        break;
      case 'DOCUMENT_VALIDATION':
        // Por enquanto leva para a lista de clientes para auditoria
        navigate(`${basePath}/clients`);
        break;
      default:
        console.log('Tarefa sem destino mapeado');
    }
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-red-50 text-red-600 border-red-100';
      case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'NORMAL': return 'bg-blue-50 text-adworks-blue border-blue-100';
      default: return 'bg-gray-50 text-gray-400 border-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  const filteredTasks = filter === 'urgent' 
    ? tasks.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH')
    : tasks;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Fila de Trabalho
          </h1>
          <p className="text-gray-500 font-medium">Ações pendentes da equipe Adworks.</p>
        </div>
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
           <button onClick={() => setFilter('all')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-adworks-dark text-white shadow-lg' : 'text-gray-400'}`}>Todos</button>
           <button onClick={() => setFilter('urgent')} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${filter === 'urgent' ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400'}`}>Urgente</button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-dashed border-gray-200 opacity-50">
             <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
             <p className="text-adworks-dark font-black uppercase tracking-widest text-sm italic">Nenhuma pendência na fila</p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-[2rem] p-8 shadow-adw-soft border border-gray-100 hover:border-adworks-blue/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${getPriorityStyle(task.priority)}`}>
                  {task.priority === 'URGENT' ? <AlertTriangle className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-black text-adworks-dark uppercase italic tracking-tight text-lg">{task.title}</h3>
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter border ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building2 className="w-3.5 h-3.5 text-gray-300" />
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{task.client_name}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                 <div className="text-right hidden md:block">
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">Entrada</p>
                    <p className="text-xs font-bold text-adworks-dark">{new Date(task.created_at).toLocaleDateString('pt-BR')}</p>
                 </div>
                 <button 
                  onClick={() => handleAttendTask(task)}
                  className="bg-adworks-gray text-adworks-dark hover:bg-adworks-blue hover:text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 group-hover:shadow-md active:scale-95"
                 >
                   <span>Atender</span>
                   <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
