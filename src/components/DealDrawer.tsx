import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  FileText,
  MessageSquare,
  History,
  ChevronRight,
  MoreVertical,
  Trash2,
  Calendar,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';

/**
 * 🗄️ DEAL DRAWER (Central Executiva)
 * Componente deslizante para gestão completa de processos.
 * Estética: Linear / Pipedrive (Minimal & Dense)
 */

interface DealDrawerProps {
  dealId: string | null;
  isOpen: boolean;
  onClose: () => void;
  dealData?: any; // Puxar via Query no futuro
}

export function DealDrawer({ dealId, isOpen, onClose, dealData }: DealDrawerProps) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'docs' | 'messages' | 'audit'>(
    'checklist'
  );

  if (!dealId) return null;

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
    { id: 'docs', label: 'Documentos', icon: FileText },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'audit', label: 'Auditoria', icon: History },
  ] as const;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[998] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[999] transform transition-transform duration-500 ease-out border-l border-slate-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* HEADER (Informações Críticas) */}
        <header className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="info"
                className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px] tracking-widest uppercase"
              >
                {dealData?.stage_key || 'ETAPA'}
              </Badge>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {dealData?.company_name || 'EMPRESA'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4 leading-tight">
            {dealData?.title || 'Processo sem título'}
          </h2>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                SLA: {dealData?.sla_status === 'breached' ? 'ATRASADO' : 'VENCE EM 2 DIAS'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">
                Alta Prioridade
              </span>
            </div>
          </div>
        </header>

        {/* TABS NAVIGATION */}
        <nav className="flex px-6 border-b border-slate-100 bg-slate-50/30 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* CONTENT AREA (Scrollable) */}
        <main className="flex-1 overflow-y-auto p-6 bg-[#FDFDFD]">
          {activeTab === 'checklist' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Itens Obrigatórios
              </h4>
              <div className="space-y-2">
                {[
                  { id: '1', title: 'Validar documentos dos sócios', done: true },
                  { id: '2', title: 'Consultar viabilidade do endereço', done: false },
                  { id: '3', title: 'Emitir taxas do Registro.br', done: false },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 transition-all cursor-pointer group shadow-sm"
                  >
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${item.done ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-200 group-hover:border-blue-400'}`}
                    >
                      {item.done && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                    <span
                      className={`text-sm font-bold tracking-tight ${item.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}
                    >
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'docs' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer">
                <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">
                  Arraste arquivos aqui
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                  PDF, JPG, PNG (Max 10MB)
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Contrato_Social_Adworks.pdf', size: '2.4 MB', date: 'Hoje, 14:20' },
                  { name: 'Comprovante_Sede.png', size: '840 KB', date: 'Ontem, 09:15' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{doc.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {doc.size} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="h-full flex flex-col animate-in fade-in duration-200">
              <div className="flex-1 space-y-6 overflow-y-auto mb-6">
                <div className="flex justify-center">
                  <Badge
                    variant="info"
                    className="bg-slate-100 text-slate-400 border-none text-[9px] font-bold"
                  >
                    HOJE
                  </Badge>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none max-w-[80%] shadow-lg shadow-blue-200/50">
                    <p className="text-sm font-medium leading-relaxed">
                      Olá Dan! O seu contrato já está pronto para assinatura. Pode verificar na aba
                      de documentos?
                    </p>
                  </div>
                  <span className="text-[9px] font-bold text-slate-400 mt-2 uppercase">
                    ENTREGUE • 15:40
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0 relative">
                <textarea
                  placeholder="Digite uma mensagem pro cliente..."
                  className="w-full bg-white border border-slate-200 rounded-2xl p-4 pr-12 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[100px] shadow-sm resize-none"
                />
                <button className="absolute right-3 bottom-3 p-2 bg-blue-600 text-white rounded-xl shadow-lg hover:scale-105 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {[
                  { action: 'Mudou para etapa CNPJ', actor: 'Matheus', time: 'Hoje, 10:30' },
                  { action: 'Anexou Contrato Social', actor: 'Dan', time: 'Ontem, 18:20' },
                  { action: 'Processo Criado', actor: 'Sistema', time: '12 Fev, 14:00' },
                ].map((log, i) => (
                  <div key={i} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-white border-2 border-slate-100 rounded-full flex items-center justify-center z-10">
                      <div className="w-2 h-2 bg-blue-600 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 tracking-tight">
                        {log.action}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        Por {log.actor} • {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* FOOTER ACTIONS */}
        <footer className="p-6 border-t border-slate-100 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              className="bg-slate-50 hover:bg-red-50 hover:text-red-600 border-none"
            >
              Arquivar
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary">Mover Etapa</Button>
            <Button variant="primary" className="bg-blue-600 shadow-lg shadow-blue-200">
              Próxima Etapa
            </Button>
          </div>
        </footer>
      </aside>
    </>
  );
}
