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

/**
 * 🏛️ ADWORKS TASK BOARD - ENTERPRISE KANBAN
 */

export function AdworksTasks() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [targetInitialStatus, setTargetInitialStatus] = useState('cnpj');

  const KANBAN_FLOW = [
    { id: 'cnpj', label: 'CNPJ', icon: Building2, color: 'border-t-adworks-blue' },
    { id: 'domain', label: 'DOMÍNIO', icon: Globe, color: 'border-t-purple-500' },
    { id: 'email', label: 'EMAIL', icon: Mail, color: 'border-t-indigo-500' },
    { id: 'site', label: 'SITE', icon: LayoutIcon, color: 'border-t-cyan-500' },
    { id: 'brand', label: 'MARCA', icon: Award, color: 'border-t-orange-500' },
    { id: 'accounting', label: 'CONTÁBIL', icon: FileText, color: 'border-t-green-500' },
  ];

  useEffect(() => {
    loadOperatorTasks();
  }, []);

  const loadOperatorTasks = async () => {
    setLoading(true);
    try {
      const { data: tickets } = await supabase
        .from('tickets')
        .select('*, client:clients(name)')
        .order('priority', { ascending: false });

      const formattedTasks = (tickets || []).map((t: any) => {
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
          status: status,
          created_at: t.created_at,
          sla_due_at: t.sla_due_at,
          data_json: t.data_json,
        };
      });

      setTasks(formattedTasks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const newStatus = destination.droppableId;
    setTasks((prev) => prev.map((t) => (t.id === draggableId ? { ...t, status: newStatus } : t)));

    // Lógica simplificada para o banco
    await supabase
      .from('tickets')
      .update({ status: 'IN_PROGRESS', updated_at: new Date().toISOString() })
      .eq('id', draggableId);
  };

  if (loading)
    return (
      <div className="p-12 space-y-8 animate-pulse bg-adworks-bg min-h-screen">
        <div className="h-10 bg-white rounded-xl w-1/4 shadow-sm" />
        <div className="flex gap-6 h-[500px]">
          <div className="w-80 bg-white/50 rounded-adw-lg" />
          <div className="w-80 bg-white/50 rounded-adw-lg" />
          <div className="w-80 bg-white/50 rounded-adw-lg" />
        </div>
      </div>
    );

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-8 overflow-hidden animate-in fade-in duration-700">
      <CardDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={selectedTask}
      />

      <NewTicketModal
        isOpen={isNewTicketModalOpen}
        onClose={() => setIsNewTicketModalOpen(false)}
        onSuccess={loadOperatorTasks}
        initialStatus={targetInitialStatus}
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0 border-b border-adworks-border pb-6 px-4 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight leading-none italic uppercase">
            Pipeline Estratégico
          </h1>
          <p className="text-adworks-muted text-xs font-bold uppercase tracking-widest mt-2 font-medium opacity-60">
            Fila de Trabalho Adworks - Empresa Pronta
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/master')}>
            <History className="w-3.5 h-3.5 mr-2" /> Histórico
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsNewTicketModalOpen(true)}
            className="bg-adworks-dark hover:bg-adworks-blue"
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> NOVO PROCESSO
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-6 overflow-x-auto pb-10 px-4 lg:px-8 scrollbar-hide">
          {KANBAN_FLOW.map((column) => (
            <div
              key={column.id}
              className="w-[320px] shrink-0 flex flex-col bg-white border border-adworks-border rounded-adw-lg shadow-sm overflow-hidden"
            >
              <div className={`p-5 border-t-4 bg-adworks-bg/30 ${column.color}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-adworks-dark">
                    <column.icon className="w-4 h-4" />
                    <span className="text-[11px] font-black uppercase tracking-widest italic">
                      {column.label}
                    </span>
                  </div>
                  <span className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-bold text-adworks-muted border border-adworks-border shadow-sm">
                    {tasks.filter((t) => t.status === column.id).length}
                  </span>
                </div>
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar"
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
                              className={`bg-white p-6 rounded-2xl shadow-sm border border-adworks-border transition-all group hover:shadow-xl hover:border-adworks-blue/30 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-adworks-blue' : ''}`}
                            >
                              <div className="flex items-start justify-between mb-4">
                                <Badge variant={task.priority === 'URGENT' ? 'danger' : 'info'}>
                                  {task.priority}
                                </Badge>
                                <button className="text-adworks-muted hover:text-adworks-dark transition-colors">
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>

                              <h4 className="font-black text-adworks-dark tracking-tight leading-tight mb-2 group-hover:text-adworks-blue transition-colors text-sm uppercase italic">
                                {task.client_name}
                              </h4>

                              <div className="mt-6 pt-4 border-t border-adworks-bg flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-6 h-6 rounded-full bg-adworks-accent flex items-center justify-center text-[8px] font-black text-adworks-blue">
                                    MG
                                  </div>
                                  <span className="text-[8px] font-black text-adworks-muted uppercase">
                                    Matheus
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 opacity-30">
                                  <MessageSquare className="w-3 h-3" />
                                  <FileText className="w-3 h-3" />
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
