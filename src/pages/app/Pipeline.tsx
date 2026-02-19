import React, { useState } from 'react';
import {
  Building2,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
  Search,
  Clock,
  MessageSquare,
  Paperclip,
  CheckCircle2,
  MoreHorizontal,
  User,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDealsBoard, useMoveDeal } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';

const STAGES = [
  { id: 'LEAD', label: 'Lead', icon: Search },
  { id: 'CONTRATADO', label: 'Contratado', icon: CheckCircle2 },
  { id: 'CNPJ', label: 'CNPJ', icon: Building2 },
  { id: 'DOMINIO', label: 'Domínio', icon: Globe },
  { id: 'EMAIL', label: 'E-mail', icon: Mail },
  { id: 'SITE', label: 'Site', icon: LayoutIcon },
  { id: 'MARCA', label: 'Marca', icon: Award },
  { id: 'CONTABILIDADE', label: 'Contábil', icon: FileText },
  { id: 'CONCLUIDO', label: 'Concluído', icon: CheckCircle2 },
];

export default function Pipeline() {
  const { data: deals, isLoading } = useDealsBoard();
  const moveDeal = useMoveDeal();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveDeal.mutate({ dealId: result.draggableId, stageKey: result.destination.droppableId });
  };

  if (isLoading)
    return <div className="p-12 animate-pulse font-black text-slate-300">SYNCING PIPELINE...</div>;

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-6 px-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Strategic Pipeline</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Gestão Operacional Enterprise
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-10 px-4 scrollbar-hide">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="w-[320px] shrink-0 flex flex-col bg-slate-100/40 rounded-2xl border border-slate-200/50"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white rounded-t-2xl shadow-sm">
                <div className="flex items-center gap-2">
                  <stage.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest italic">
                    {stage.label}
                  </span>
                </div>
                <span className="bg-slate-50 text-slate-400 text-[10px] font-black px-2 py-0.5 rounded-lg border border-slate-100">
                  {deals?.filter((d: any) => d.stage_key === stage.id).length || 0}
                </span>
              </div>

              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[200px]"
                  >
                    {deals
                      ?.filter((d: any) => d.stage_key === stage.id)
                      .map((deal: any, index: number) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-xl ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-blue-600' : ''} ${deal.sla_status === 'breached' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-blue-600'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <Badge
                                  variant={deal.sla_status === 'breached' ? 'danger' : 'success'}
                                >
                                  {deal.sla_status === 'breached' ? 'OVERDUE' : 'ON TRACK'}
                                </Badge>
                                <MoreHorizontal className="w-4 h-4 text-slate-300" />
                              </div>

                              <h4 className="font-bold text-slate-900 text-sm leading-tight mb-4 uppercase tracking-tight">
                                {deal.company_name}
                              </h4>

                              <div className="space-y-2 border-t border-slate-50 pt-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400">
                                  <span>Contract</span>
                                  <span className="text-slate-900 font-black italic">
                                    R$ {(deal.value_cents / 100).toLocaleString()}
                                  </span>
                                </div>
                              </div>

                              <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100">
                                    U
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-500 uppercase">
                                    Operator
                                  </span>
                                </div>
                                <div className="flex gap-2">
                                  <MessageSquare className="w-3.5 h-3.5 text-slate-300" />
                                  <FileText className="w-3.5 h-3.5 text-slate-300" />
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
