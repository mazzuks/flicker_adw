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
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CardDetailModal } from '../../components/CardDetailModal';
import { NewTicketModal } from '../../components/NewTicketModal';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';

interface OperatorTask {
  id: string;
  type: string;
  title: string;
  client_name: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: string;
  created_at: string;
  sla_due_at: string | null;
}

const KANBAN_FLOW = [
  { id: 'cnpj', label: 'CNPJ', icon: Building2, color: 'border-t-adworks-blue' },
  { id: 'domain', label: 'DOMÍNIO', icon: Globe, color: 'border-t-purple-500' },
  { id: 'email', label: 'EMAIL', icon: Mail, color: 'border-t-indigo-500' },
  { id: 'site', label: 'SITE', icon: LayoutIcon, color: 'border-t-cyan-500' },
  { id: 'brand', label: 'MARCA', icon: Award, color: 'border-t-orange-500' },
  { id: 'accounting', label: 'CONTÁBIL', icon: FileText, color: 'border-t-green-500' },
];

export function AdworksTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<OperatorTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<OperatorTask | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [targetInitialStatus, setTargetInitialStatus] = useState('cnpj');

  useEffect(() => {
    loadOperatorTasks();
  }, []);

  const loadOperatorTasks = async () => {
    setLoading(true);
    const { data: tickets } = await supabase
      .from('tickets')
      .select('*, client:clients(name)')
      .order('priority', { ascending: false });

    const formattedTasks: OperatorTask[] = (tickets || []).map((t) => {
      // Mapeamento dinâmico para as colunas do fluxo core
      let status = 'cnpj';
      if (t.type === 'TICKET_INPI') status = 'brand';
      else if (t.type === 'TICKET_FISCAL') status = 'accounting';

      return {
        id: t.id,
        type: t.type,
        title:
          t.type === 'TICKET_CNPJ'
            ? 'Abertura CNPJ'
            : t.type === 'TICKET_INPI'
              ? 'Marca INPI'
              : 'Fiscal',
        client_name: t.client?.name || 'Cliente Desconhecido',
        priority: t.priority,
        status: status, // Aqui o status segue a coluna do fluxo
        created_at: t.created_at,
        sla_due_at: t.sla_due_at,
      };
    });

    setTasks(formattedTasks);
    setLoading(false);
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t)));

    // Lógica de troca de tipo/status no banco conforme a coluna
    // Ex: Se mover para 'brand', muda o type do ticket para TICKET_INPI
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-8 overflow-hidden animate-in fade-in duration-700 max-w-full">
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0 border-b border-adworks-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none italic uppercase">
            Pipeline Estratégico
          </h1>
          <p className="text-adworks-muted text-xs font-bold uppercase tracking-widest mt-2">
            Visão consolidada do fluxo Empresa Pronta
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <History className="w-3.5 h-3.5 mr-2" /> Histórico
          </Button>
          <Button variant="primary" size="sm" onClick={() => setIsNewTicketModalOpen(true)}>
            <Plus className="w-3.5 h-3.5 mr-2" /> NOVO PROCESSO
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-10 scrollbar-hide">
          {KANBAN_FLOW.map((column) => (
            <div
              key={column.id}
              className="w-[320px] shrink-0 flex flex-col bg-adworks-bg/60 rounded-[2.5rem] border border-adworks-border/50 shadow-inner"
            >
              <div
                className={`p-6 bg-white rounded-t-[2.5rem] border-t-4 mb-4 shadow-sm ${column.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <column.icon className="w-4 h-4 text-adworks-muted" />
                    <h3 className="font-black text-adworks-dark uppercase tracking-widest text-[11px] italic leading-none">
                      {column.label}
                    </h3>
                  </div>
                  <span className="bg-adworks-bg px-2.5 py-1 rounded-lg text-[10px] font-black text-adworks-muted border border-adworks-border">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto space-y-4 px-4 custom-scrollbar"
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
                              className={`bg-white p-6 rounded-[2rem] shadow-sm border border-adworks-border transition-all group hover:shadow-xl hover:border-adworks-blue/20 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-adworks-blue' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant={task.priority === 'URGENT' ? 'danger' : 'info'}>
                                  {task.priority}
                                </Badge>
                                <button className="text-adworks-muted hover:text-adworks-dark">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>

                              <h4 className="font-black text-adworks-dark tracking-tight leading-tight mb-2 group-hover:text-adworks-blue transition-colors text-sm uppercase italic">
                                {task.client_name}
                              </h4>

                              <div className="mt-6 pt-4 border-t border-adworks-bg flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-6 h-6 rounded-full bg-adworks-accent flex items-center justify-center text-[8px] font-black text-adworks-blue border border-adworks-border">
                                    MG
                                  </div>
                                  <span className="text-[8px] font-black text-adworks-muted uppercase">
                                    Matheus
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1 text-[9px] font-black text-adworks-muted uppercase">
                                    <MessageSquare className="w-3 h-3" />
                                  </div>
                                  <div className="flex items-center gap-1 text-[9px] font-black text-adworks-muted uppercase">
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
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
