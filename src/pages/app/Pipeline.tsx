import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Plus,
  MessageSquare,
  Paperclip,
  History,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useUIStore } from '../../store/useUIStore';
import { Badge } from '../../components/ui/Badge';

/**
 * 🌪️ CORE PIPELINE KANBAN (Enterprise Rebuild)
 * Standardized 9-stage flow: Lead → Completed
 */

const STAGES = [
  { id: 'lead', label: 'Lead', icon: Search },
  { id: 'contracted', label: 'Contratado', icon: CheckCircle2 },
  { id: 'cnpj', label: 'CNPJ', icon: Building2 },
  { id: 'domain', label: 'Domínio', icon: Globe },
  { id: 'email', label: 'E-mail', icon: Mail },
  { id: 'site', label: 'Site', icon: LayoutIcon },
  { id: 'brand', label: 'Marca', icon: Award },
  { id: 'accounting', label: 'Contabilidade', icon: FileText },
  { id: 'completed', label: 'Concluído', icon: CheckCircle2 },
];

const MOCK_DEALS = [
  {
    id: '1',
    name: 'Restaurante Sabor & Arte',
    stage: 'cnpj',
    priority: 'URGENT',
    value: 'R$ 2.450',
    operator: 'Matheus',
    sla: 'SLA -2d',
    slaStatus: 'breached',
    blocked: true,
  },
  {
    id: '2',
    name: 'Clínica Sorriso',
    stage: 'lead',
    priority: 'NORMAL',
    value: 'R$ 1.800',
    operator: 'Dan',
    sla: 'SLA 2d',
    slaStatus: 'ok',
    blocked: false,
  },
];

export default function Pipeline() {
  const { selectDeal } = useUIStore();
  const [processes, setProcesses] = useState(MOCK_DEALS);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setProcesses((prev) =>
      prev.map((p) => (p.id === draggableId ? { ...p, stage: destination.droppableId } : p))
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Strategic Pipeline</h1>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">
            Fluxo de Contratação e Operação
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-sm hover:bg-slate-50 transition-all">
            FILTRAR
          </button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-xs font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> NOVO PROCESSO
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-8 scrollbar-hide">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="w-[320px] shrink-0 flex flex-col bg-slate-200/20 rounded-2xl p-2 border border-slate-200/40"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <stage.icon className="w-4 h-4 text-slate-400" />
                  <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    {stage.label}
                  </h3>
                </div>
                <span className="bg-white px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
                  {processes.filter((p) => p.stage === stage.id).length}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto p-2 space-y-4 custom-scrollbar min-h-[200px]"
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
                              onClick={() => selectDeal(process.id)}
                              className={`bg-white p-6 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-xl ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl border-blue-600 z-50' : ''} ${process.blocked ? 'bg-red-50/30 border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-600'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <Badge variant={process.slaStatus as any}>{process.sla}</Badge>
                                <MoreHorizontal className="w-4 h-4 text-slate-300" />
                              </div>

                              <h4 className="font-bold text-slate-900 text-[15px] leading-tight mb-2 uppercase tracking-tight">
                                {process.name}
                              </h4>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
                                Etapa: {stage.label}
                              </p>

                              <div className="space-y-3 border-y border-slate-50 py-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                  <span>Valor Contrato</span>
                                  <span className="text-slate-900 font-black italic">
                                    {process.value}
                                  </span>
                                </div>
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                  <span>Status</span>
                                  <span
                                    className={process.blocked ? 'text-red-600' : 'text-green-600'}
                                  >
                                    {process.blocked ? 'BLOQUEADO' : 'NORMAL'}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100">
                                    {process.operator.charAt(0)}
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    {process.operator}
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <MessageSquare className="w-4 h-4 text-slate-200 hover:text-blue-600 transition-colors" />
                                  <FileText className="w-4 h-4 text-slate-200 hover:text-blue-600 transition-colors" />
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
