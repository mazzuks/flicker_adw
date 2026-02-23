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
  ChevronRight,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useDealsBoard, useMoveDeal } from '../../lib/queries';
import { Badge } from '../../components/ui/Badge';
import { useUIStore } from '../../store/useUIStore';
import { DealDrawer } from '../../components/DealDrawer';

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
  const { isDrawerOpen, selectedDealId, openDeal, closeDrawer } =
    useUIStore();

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    moveDeal.mutate({ dealId: result.draggableId, stageKey: result.destination.droppableId });
  };

  if (isLoading)
    return (
      <div className="p-12 animate-pulse font-black text-slate-300 tracking-[0.5em] uppercase italic">
        Syncing Engine...
      </div>
    );

  const currentDeal = deals?.find((d: any) => d.id === selectedDealId);

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden relative">
      <div className="flex items-center justify-between shrink-0 border-b border-slate-200 pb-6 px-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase italic">
            Strategic Pipeline
          </h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 italic">
            Fila de Execucao em Tempo Real
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
                  <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider italic">
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
                                    ? 'Atrasado'
                                    : deal.sla_status === 'warning'
                                      ? 'Vence 48h'
                                      : 'No Prazo'}
                                </span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center text-slate-300 hover:text-slate-900 rounded-full hover:bg-slate-50 transition-all"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              </div>

                              <h4 className="font-bold text-[14px] text-slate-900 leading-tight mb-1 uppercase tracking-tight italic">
                                {deal.company_name}
                              </h4>
                              <p className="text-[12px] text-slate-500 font-medium">{deal.title}</p>

                              <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
                                <div className="text-[11px] font-black text-slate-900 italic uppercase">
                                  R$ {(deal.value_cents / 100).toLocaleString('pt-BR')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 gap-1">
                                    <MessageSquare className="w-4 h-4" />
                                  </div>
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 gap-1">
                                    <Paperclip className="w-4 h-4" />
                                  </div>
                                  <div className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-300 gap-1">
                                    <CheckCircle2 className="w-4 h-4" />
                                  </div>
                                  <ChevronRight className="w-4 h-4 text-slate-200" />
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
                <button className="w-full py-2 bg-white rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 hover:shadow-md transition-all italic">
                  + Add Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>

      {/* 🌪️ DEAL DRAWER (Central Executiva) */}
      <DealDrawer
        isOpen={isDrawerOpen}
        dealId={selectedDealId}
        onClose={closeDrawer}
        dealData={currentDeal}
      />
    </div>
  );
}
