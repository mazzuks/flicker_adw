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
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CardDetailModal } from '../../components/CardDetailModal';

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

const COLUMNS = [
  { id: 'NEW', title: 'Backlog / Novos', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', title: 'Em Andamento', color: 'bg-adworks-blue' },
  { id: 'WAITING_CLIENT', title: 'Aguardando Cliente', color: 'bg-orange-500' },
  { id: 'DONE', title: 'Concluídos', color: 'bg-green-500' },
];

export function AdworksTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<OperatorTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadOperatorTasks();
  }, []);

  const loadOperatorTasks = async () => {
    setLoading(true);
    const { data: tickets } = await supabase
      .from('tickets')
      .select('*, client:clients(name)')
      .order('priority', { ascending: false });

    const formattedTasks: OperatorTask[] = (tickets || []).map(t => ({
      id: t.id,
      type: t.type,
      title: t.type === 'TICKET_CNPJ' ? 'Abertura CNPJ' : t.type === 'TICKET_INPI' ? 'Marca INPI' : 'Fiscal',
      client_name: t.client?.name || 'Cliente Desconhecido',
      priority: t.priority,
      status: t.status,
      created_at: t.created_at,
      sla_due_at: t.sla_due_at
    }));

    setTasks(formattedTasks);
    setLoading(false);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks(prev => prev.map(t => t.id === draggableId ? { ...t, status: newStatus } : t));

    await supabase
      .from('tickets')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', draggableId);
  };

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'URGENT': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-400';
      case 'NORMAL': return 'bg-blue-400';
      default: return 'bg-slate-300';
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
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden">
      <CardDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        task={selectedTask} 
      />

      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic leading-none">Fila de Trabalho</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Gerenciamento dinâmico de processos operacionais.</p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {COLUMNS.map((column) => (
            <div key={column.id} className="w-[320px] shrink-0 flex flex-col bg-[#EBEEF0] rounded-[2rem] p-4 border border-transparent hover:border-slate-300 transition-colors shadow-inner">
              <div className="flex items-center justify-between px-4 py-3 mb-4">
                <div className="flex items-center gap-2">
                   <div className={`w-2 h-2 rounded-full ${column.color}`}></div>
                   <h3 className="font-black text-adworks-dark uppercase tracking-tighter text-sm italic">{column.title}</h3>
                </div>
                <span className="bg-white/50 px-2.5 py-1 rounded-lg text-[10px] font-black text-gray-500 border border-white">
                  {tasks.filter(t => t.status === column.id).length}
                </span>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto space-y-3 px-1"
                  >
                    {tasks.filter(t => t.status === column.id).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => {
                              setSelectedTask(task);
                              setIsModalOpen(true);
                            }}
                            className={`bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-200 transition-all group hover:shadow-xl hover:border-adworks-blue/20 ${snapshot.isDragging ? 'rotate-3 scale-105 shadow-2xl z-50 border-adworks-blue' : ''}`}
                          >
                            <div className="flex items-start justify-between mb-4">
                               <div className={`text-[8px] font-black px-2 py-0.5 rounded-full text-white uppercase tracking-widest ${getPriorityStyle(task.priority)}`}>
                                  {task.priority}
                               </div>
                               <button className="text-gray-300 hover:text-adworks-dark transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                            </div>

                            <h4 className="font-black text-adworks-dark tracking-tight leading-tight mb-2 group-hover:text-adworks-blue transition-colors text-sm uppercase italic">
                              {task.title}
                            </h4>

                            <div className="space-y-2">
                               <div className="flex items-center gap-2">
                                  <Building2 className="w-3 h-3 text-gray-300" />
                                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter truncate">{task.client_name}</p>
                               </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                               <div className="flex -space-x-1">
                                  <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">MG</div>
                               </div>
                               <div className="flex items-center gap-2">
                                  {task.sla_due_at && (
                                    <div className="flex items-center gap-1 text-[9px] font-black text-orange-500 uppercase tracking-tighter bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
                                       <Clock className="w-3 h-3" />
                                       SLA
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 text-[9px] font-black text-gray-300 uppercase">
                                     <FileText className="w-3 h-3" />
                                  </div>
                               </div>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              
              <button className="mt-4 w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-adworks-blue hover:text-adworks-blue hover:bg-white transition-all">
                + Novo Processo
              </button>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
