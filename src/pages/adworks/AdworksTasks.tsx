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
  MoreHorizontal,
  Award,
  Globe,
  Mail,
  Layout as LayoutIcon,
  MessageSquare,
  History,
  Zap,
  DollarSign,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CardDetailModal } from '../../components/CardDetailModal';
import { NewTicketModal } from '../../components/NewTicketModal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

/**
 * 🌪️ ADWORKS STRATEGIC PIPELINE (The Heart of the Product)
 * Standardized 9-stage flow: Lead → Completed
 */

const KANBAN_FLOW = [
  { id: 'lead', label: 'Lead', icon: Search, color: 'border-t-slate-400' },
  { id: 'contracted', label: 'Contratado', icon: CheckSquare, color: 'border-t-adworks-blue' },
  { id: 'cnpj', label: 'CNPJ', icon: Building2, color: 'border-t-blue-600' },
  { id: 'domain', label: 'Domínio', icon: Globe, color: 'border-t-purple-500' },
  { id: 'email', label: 'Email', icon: Mail, color: 'border-t-indigo-500' },
  { id: 'site', label: 'Site', icon: LayoutIcon, color: 'border-t-cyan-500' },
  { id: 'brand', label: 'Marca', icon: Award, color: 'border-t-orange-500' },
  { id: 'accounting', label: 'Contábil', icon: FileText, color: 'border-t-green-500' },
  { id: 'completed', label: 'Concluído', icon: CheckCircle2, color: 'border-t-green-700' },
];

export function AdworksTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  useEffect(() => {
    loadOperatorTasks();
  }, []);

  const loadOperatorTasks = async () => {
    setLoading(true);
    const { data: tickets } = await supabase
      .from('tickets')
      .select('*, client:clients(name)')
      .order('priority', { ascending: false });

    // Mock data if database mapping is missing (ensuring UI renders the new 9 stages)
    const formattedTasks = (tickets || []).map((t: any) => ({
      id: t.id,
      title: t.client?.name || 'Empresa em Abertura',
      client_name: t.client?.name || 'Cliente Adworks',
      priority: t.priority,
      status: t.status.toLowerCase(), // Lead, CNPJ, etc.
      responsible: 'Matheus',
      value: 'R$ 2.450,00',
      sla_days: 12,
      is_blocked: t.status === 'WAITING_CLIENT',
    }));

    setTasks(formattedTasks);
    setLoading(false);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t)));

    await supabase
      .from('tickets')
      .update({ status: newStatus.toUpperCase(), updated_at: new Date().toISOString() })
      .eq('id', draggableId);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-6 overflow-hidden animate-in fade-in duration-500 bg-[#F6F7FB] -m-8 p-12">
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
      />
      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSuccess={loadOperatorTasks}
        initialStatus="lead"
      />

      <div className="flex items-center justify-between shrink-0 border-b border-[#E6E9F2] pb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#0B1220] tracking-tight italic uppercase">
            Strategic Pipeline
          </h1>
          <p className="text-[#5B667A] text-sm font-medium mt-2">
            Fluxo de Contratação e Operação Empresa Pronta.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="md">
            FILTER
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="bg-[#0B1220] text-white"
            onClick={() => setIsNewTicketModalOpen(true)}
          >
            + ADD PROJECT
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
          {KANBAN_FLOW.map((column) => (
            <div
              key={column.id}
              className="w-[320px] shrink-0 flex flex-col bg-transparent rounded-2xl"
            >
              <div className={`p-4 mb-4 border-t-4 bg-white rounded-xl shadow-sm ${column.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <column.icon className="w-4 h-4 text-[#5B667A]" />
                    <h3 className="font-bold text-[#0B1220] uppercase tracking-widest text-[11px]">
                      {column.label}
                    </h3>
                  </div>
                  <span className="text-[10px] font-black text-[#5B667A]">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto space-y-4 px-1 custom-scrollbar"
                  >
                    {tasks
                      .filter((t) => t.status === column.id)
                      .map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => {
                                setSelectedTask(task);
                                setIsDetailModalOpen(true);
                              }}
                              className={`bg-white p-6 rounded-2xl shadow-sm border border-[#E6E9F2] transition-all hover:shadow-xl ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl border-[#1E5BFF]' : ''} ${task.is_blocked ? 'bg-red-50/50 border-red-200' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-1.5 h-1.5 rounded-full ${task.is_blocked ? 'bg-[#EF4444] animate-pulse' : 'bg-green-500'}`}
                                  />
                                  <span
                                    className={`text-[9px] font-black uppercase ${task.is_blocked ? 'text-[#EF4444]' : 'text-green-600'}`}
                                  >
                                    {task.is_blocked ? 'BLOCKED' : 'ON TRACK'}
                                  </span>
                                </div>
                                <MoreHorizontal className="w-4 h-4 text-[#5B667A]" />
                              </div>

                              <h4 className="font-bold text-[#0B1220] tracking-tight text-base mb-4 uppercase">
                                {task.client_name}
                              </h4>

                              <div className="space-y-4">
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#5B667A]">
                                  <span>Contract Value</span>
                                  <span className="text-[#0B1220]">{task.value}</span>
                                </div>
                                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-[#5B667A]">
                                  <span>SLA Timer</span>
                                  <div className="flex items-center gap-1.5 text-[#1E5BFF]">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{task.sla_days} DAYS LEFT</span>
                                  </div>
                                </div>
                              </div>

                              <div className="mt-8 pt-4 border-t border-[#F6F7FB] flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-[#EEF3FF] rounded-lg flex items-center justify-center text-[10px] font-black text-[#1E5BFF]">
                                    {task.responsible.charAt(0)}
                                  </div>
                                  <span className="text-[10px] font-bold text-[#5B667A] uppercase">
                                    {task.responsible}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <MessageSquare className="w-3.5 h-3.5 text-[#E6E9F2]" />
                                  <FileText className="w-3.5 h-3.5 text-[#E6E9F2]" />
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
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
