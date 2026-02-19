import { useState, useEffect } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
  Clock,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { supabase } from '../../lib/supabase';
import { Badge } from '../../components/ui/Badge';

/**
 * 🏛️ CORE PIPELINE KANBAN (Refoundation 2.0)
 * Fixed 9 stages from Lead to Completed
 */

const STAGES = [
  { id: 'lead', label: 'Lead', icon: Search },
  { id: 'contracted', label: 'Contratado', icon: CheckCircle2 },
  { id: 'cnpj', label: 'CNPJ', icon: Building2 },
  { id: 'domain', label: 'Domínio', icon: Globe },
  { id: 'email', label: 'E-mail', icon: Mail },
  { id: 'site', label: 'Site', icon: LayoutIcon },
  { id: 'brand', label: 'Marca', icon: Award },
  { id: 'accounting', label: 'Contábil', icon: FileText },
  { id: 'completed', label: 'Concluído', icon: CheckCircle2 },
];

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function Pipeline() {
  const [processes, setProcesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProcesses();
  }, []);

  const fetchProcesses = async () => {
    setLoading(true);
    // Em produção: fetch real. Aqui usamos mock estruturado conforme migration 2.0
    const mock = [
      {
        id: '1',
        name: 'Restaurante Sabor & Arte',
        stage: 'cnpj',
        priority: 'URGENT',
        value: 'R$ 2.450',
        operator: 'Matheus',
        sla: '12d',
      },
      {
        id: '2',
        name: 'Clínica Sorriso',
        stage: 'lead',
        priority: 'NORMAL',
        value: 'R$ 1.800',
        operator: 'Dan',
        sla: '2d',
      },
    ];
    setTimeout(() => {
      setProcesses(mock);
      setLoading(false);
    }, 500);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setProcesses((prev) =>
      prev.map((p) => (p.id === draggableId ? { ...p, stage: destination.droppableId } : p))
    );
    // TODO: persist to DB
  };

  if (loading)
    return (
      <div className="p-8 animate-pulse text-slate-400 font-bold tracking-widest">
        LOADING ENGINE...
      </div>
    );

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <h1 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
          Strategic Pipeline
        </h1>
        <div className="flex gap-2">
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-lg">
            + NOVO PROCESSO
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-6 scrollbar-hide">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="w-[280px] shrink-0 flex flex-col bg-slate-100/50 rounded-xl p-3 border border-slate-200/50"
            >
              <div className="flex items-center justify-between px-2 mb-4 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <stage.icon className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                    {stage.label}
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400">
                  {processes.filter((p) => p.stage === stage.id).length}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 space-y-3 min-h-[100px]"
                  >
                    {processes
                      .filter((p) => p.stage === stage.id)
                      .map((process, index) => (
                        <Draggable key={process.id} draggableId={process.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-4 rounded-xl shadow-sm border border-slate-200 transition-all ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-xl border-blue-600' : 'hover:border-blue-400'}`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <Badge
                                  variant={process.priority === 'URGENT' ? 'danger' : 'neutral'}
                                >
                                  {process.priority}
                                </Badge>
                                <MoreHorizontal className="w-4 h-4 text-slate-300" />
                              </div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight mb-4">
                                {process.name}
                              </h4>

                              <div className="space-y-2 border-t border-slate-50 pt-3">
                                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                                  <span>Valor</span>
                                  <span className="text-slate-900">{process.value}</span>
                                </div>
                                <div className="flex justify-between text-[9px] font-bold uppercase text-slate-400">
                                  <span>SLA</span>
                                  <span className="text-blue-600">{process.sla}</span>
                                </div>
                              </div>

                              <div className="mt-4 flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-200">
                                    {process.operator.charAt(0)}
                                  </div>
                                  <span className="text-[8px] font-bold text-slate-500 uppercase">
                                    {process.operator}
                                  </span>
                                </div>
                                <div className="flex gap-2 opacity-20">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
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
