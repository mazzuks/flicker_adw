import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Search,
  Filter,
  Plus,
  MessageSquare,
  Paperclip,
  History,
  Clock,
  ArrowRight,
  MoreHorizontal,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User,
  DollarSign,
  Globe,
  Mail,
  Layout as LayoutIcon,
  Award,
  FileText,
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useUIStore } from '../../store/useUIStore';

// --- STAGES CONFIGURATION (Standardized 9-stage flow) ---
const STAGES = [
  { id: 'lead', name: 'Lead', icon: Search },
  { id: 'contracted', name: 'Contratado', icon: CheckCircle2 },
  { id: 'cnpj', name: 'CNPJ', icon: Building2 },
  { id: 'domain', name: 'Domínio', icon: Globe },
  { id: 'email', name: 'E-mail', icon: Mail },
  { id: 'site', name: 'Site', icon: LayoutIcon },
  { id: 'brand', name: 'Marca', icon: Award },
  { id: 'accounting', name: 'Contabilidade', icon: FileText },
  { id: 'completed', name: 'Concluído', icon: CheckCircle2 },
];

const DEALS = [
  {
    id: 'd1',
    title: 'Restaurante Sabor & Arte',
    stageId: 'cnpj',
    value: 'R$ 2.450',
    owner: 'Matheus',
    sla: '2d',
    slaStatus: 'warning',
    priority: 'HIGH',
    blocked: true,
  },
  {
    id: 'd2',
    title: 'Clínica Sorriso',
    stageId: 'lead',
    value: 'R$ 1.800',
    owner: 'Dan',
    sla: 'ok',
    slaStatus: 'ok',
    priority: 'NORMAL',
    blocked: false,
  },
];

export default function Pipeline() {
  const { openDeal } = useUIStore();
  const [processes, setProcesses] = useState(DEALS);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { draggableId, destination } = result;
    setProcesses((prev) =>
      prev.map((p) => (p.id === draggableId ? { ...p, stageId: destination.droppableId } : p))
    );
  };

  return (
    <div className="h-full flex flex-col space-y-6 overflow-hidden bg-[#F7F8FA] p-8 -m-8">
      {/* 🏛️ TOPBAR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">
            Strategic Pipeline
          </h1>
          <p className="text-slate-500 text-xs font-medium">
            Gestão operacional de processos ativos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Buscar (Ctrl+K)"
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-600 outline-none w-64 shadow-sm"
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Processo
          </button>
        </div>
      </header>

      {/* 🌪️ KANBAN BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 flex gap-4 overflow-x-auto pb-10 scrollbar-hide">
          {STAGES.map((stage) => (
            <div key={stage.id} className="w-[340px] shrink-0 flex flex-col">
              {/* Column Header */}
              <div className="p-4 bg-white border border-slate-200 rounded-t-xl border-b-0 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2.5">
                  {stage.icon && <stage.icon className="w-4 h-4 text-slate-400" />}
                  <h3 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider">
                    {stage.name}
                  </h3>
                  <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {processes.filter((p) => p.stageId === stage.id).length}
                  </span>
                </div>
                <MoreHorizontal className="w-4 h-4 text-slate-300" />
              </div>

              <Droppable droppableId={stage.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex-1 bg-slate-200/30 rounded-b-xl border border-slate-200 p-3 space-y-3 overflow-y-auto custom-scrollbar shadow-inner min-h-[200px]"
                  >
                    {processes
                      .filter((p) => p.stageId === stage.id)
                      .map((deal, index) => (
                        <Draggable key={deal.id} draggableId={deal.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => openDeal(deal.id)}
                              className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md cursor-pointer group active:scale-95 ${snapshot.isDragging ? 'rotate-2 scale-105 shadow-2xl border-blue-600 z-50' : ''} ${deal.blocked ? 'border-l-4 border-l-red-500 bg-red-50/20' : 'border-l-4 border-l-blue-600'}`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <span
                                  className={`text-[10px] font-black uppercase tracking-tighter ${deal.blocked ? 'text-red-600 animate-pulse' : 'text-slate-400'}`}
                                >
                                  {deal.blocked ? '⚠️ BLOCKED' : 'ON TRACK'}
                                </span>
                                <BadgeStatus
                                  variant={deal.slaStatus}
                                >{`SLA ${deal.sla}`}</BadgeStatus>
                              </div>

                              <h4 className="text-[15px] font-bold text-slate-900 leading-tight mb-4 group-hover:text-blue-600 transition-colors uppercase">
                                {deal.title}
                              </h4>

                              <div className="grid grid-cols-2 gap-4 mb-5 border-y border-slate-50 py-3">
                                <div className="space-y-0.5">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    Valor
                                  </p>
                                  <p className="text-xs font-bold text-slate-900 italic">
                                    {deal.value}
                                  </p>
                                </div>
                                <div className="space-y-0.5 border-l border-slate-100 pl-4">
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    Responsável
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-0.5">
                                    <div className="w-4 h-4 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-blue-600 border border-blue-100">
                                      {deal.owner.charAt(0)}
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600">
                                      {deal.owner}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2">
                                <div className="flex gap-3 text-slate-300">
                                  <div className="flex items-center gap-1 hover:text-blue-600 transition-colors">
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black">2</span>
                                  </div>
                                  <div className="flex items-center gap-1 hover:text-slate-900 transition-colors">
                                    <History className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black">12</span>
                                  </div>
                                  <div className="flex items-center gap-1 hover:text-green-600 transition-colors">
                                    <Paperclip className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                                <button className="w-7 h-7 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                                  <ArrowRight className="w-4 h-4" />
                                </button>
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
    </div>
  );
}

function BadgeStatus({ variant, children }: any) {
  const styles = {
    ok: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    warning: 'bg-amber-50 text-amber-600 border-amber-100',
    breached: 'bg-red-50 text-red-600 border-red-100',
  };
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
        (styles as any)[variant]
      }`}
    >
      {children}
    </span>
  );
}
