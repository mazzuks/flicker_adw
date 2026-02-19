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
  X,
  ExternalLink,
  History,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDealsBoard, useMoveDeal } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';
import { useUIStore } from '../../store/useUIStore';
import { EmptyState } from '../../components/ui/EmptyState';

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
  const { isDrawerOpen, selectedDealId, openDeal, closeDrawer, activeDrawerTab, setTab } =
    useUIStore();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveDeal.mutate({ dealId: result.draggableId, stageKey: result.destination.droppableId });
  };

  if (isLoading)
    return (
      <div className="p-12 animate-pulse font-black text-slate-300 tracking-widest">
        SYNCING ENGINE...
      </div>
    );

  const currentDeal = deals?.find((d: any) => d.id === selectedDealId);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden relative">
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-6 px-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
            Strategic Pipeline
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
            Fila de Execução em Tempo Real
          </p>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-10 px-4 scrollbar-hide">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              className="w-[340px] shrink-0 flex flex-col bg-slate-200/20 rounded-2xl p-2 border border-slate-200/40"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-white rounded-t-2xl shadow-sm">
                <div className="flex items-center gap-2.5">
                  <stage.icon className="w-4 h-4 text-slate-400" />
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                    {stage.label}
                  </span>
                </div>
                <Badge variant="neutral">
                  {deals?.filter((d: any) => d.stage_key === stage.id).length || 0}
                </Badge>
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
                              onClick={() => openDeal(deal.id)}
                              className={`bg-white p-5 rounded-2xl shadow-sm border border-slate-200 transition-all hover:shadow-xl hover:border-blue-400 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl z-50 border-blue-600' : ''} ${deal.sla_status === 'breached' ? 'border-l-4 border-l-red-500 bg-red-50/10' : 'border-l-4 border-l-blue-600'}`}
                            >
                              <div className="flex justify-between items-start mb-4">
                                <span
                                  className={`text-[12px] font-semibold flex items-center gap-1.5 ${deal.sla_status === 'breached' ? 'text-red-600' : deal.sla_status === 'warning' ? 'text-amber-600' : 'text-emerald-600'}`}
                                >
                                  <Clock className="w-4 h-4" />
                                  {deal.sla_status === 'breached'
                                    ? 'Atrasado 1d'
                                    : deal.sla_status === 'warning'
                                      ? 'Vence 48h'
                                      : 'OK 5d'}
                                </span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-all"
                                  title="Opções"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>

                              <h4 className="font-semibold text-[14px] text-slate-900 leading-tight mb-1 uppercase tracking-tight">
                                {deal.company_name}
                              </h4>
                              <p className="text-[12px] text-slate-500 font-medium">{deal.title}</p>

                              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-[12px] font-semibold text-slate-900">
                                  R$ {(deal.value_cents / 100).toLocaleString('pt-BR')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeal(deal.id, 'comments');
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-blue-600 transition-all gap-1"
                                    title="Mensagens"
                                  >
                                    <MessageSquare className="w-[18px] h-[18px]" />
                                    <span className="text-[12px]">2</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeal(deal.id, 'files');
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-emerald-600 transition-all gap-1"
                                    title="Documentos"
                                  >
                                    <Paperclip className="w-[18px] h-[18px]" />
                                    <span className="text-[12px]">{deal.docs_count}</span>
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openDeal(deal.id, 'tasks');
                                    }}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-400 hover:text-amber-600 transition-all gap-1"
                                    title="Checklist"
                                  >
                                    <CheckCircle2 className="w-[18px] h-[18px]" />
                                    <span className="text-[12px]">
                                      {deal.checklist_done}/{deal.checklist_total}
                                    </span>
                                  </button>
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

              <div className="p-2 border border-slate-200 border-t-0 rounded-b-xl bg-white/30">
                <button className="w-full py-2 bg-white rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:shadow-md transition-all">
                  + Add Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* 🌪️ DEAL DRAWER (Trello-like) */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[200]"
            onClick={closeDrawer}
          />
          <div className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-white shadow-2xl z-[210] animate-in slide-in-from-right duration-300 border-l border-slate-200">
            <div className="h-16 border-b border-slate-100 flex items-center justify-between px-8 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-slate-900 uppercase tracking-tight">
                  {currentDeal?.company_name}
                </h2>
              </div>
              <button onClick={closeDrawer} className="p-2 text-slate-400 hover:text-slate-900">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex border-b border-slate-100 bg-white sticky top-0 px-8 gap-6">
              {[
                { id: 'overview', label: 'Resumo', icon: LayoutIcon },
                { id: 'tasks', label: 'Checklist', icon: CheckCircle2 },
                { id: 'files', label: 'Docs', icon: Paperclip },
                { id: 'comments', label: 'Chat', icon: MessageSquare },
                { id: 'activities', label: 'Histórico', icon: History },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id as any)}
                  className={`py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeDrawerTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
              {activeDrawerTab === 'overview' && (
                <div className="space-y-8">
                  <Card className="border-l-4 border-l-blue-600">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                      Etapa Atual
                    </p>
                    <h3 className="text-xl font-bold text-slate-900">{currentDeal?.stage_key}</h3>
                  </Card>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Valor</p>
                      <p className="text-lg font-bold">R$ {currentDeal?.value_cents / 100}</p>
                    </Card>
                    <Card>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                        Status SLA
                      </p>
                      <Badge variant={currentDeal?.sla_status}>
                        {currentDeal?.sla_status?.toUpperCase()}
                      </Badge>
                    </Card>
                  </div>
                </div>
              )}

              {activeDrawerTab !== 'overview' && (
                <EmptyState
                  title={`Módulo de ${activeDrawerTab} em integração`}
                  description={`Os dados reais da aba ${activeDrawerTab} serão conectados na próxima fatia de backend.`}
                  icon={
                    activeDrawerTab === 'comments'
                      ? MessageSquare
                      : activeDrawerTab === 'files'
                        ? Paperclip
                        : History
                  }
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
