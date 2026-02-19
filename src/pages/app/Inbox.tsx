import React, { useState } from 'react';
import { useDealsBoard } from '../../lib/queries';
import {
  Search,
  Filter,
  MessageSquare,
  User,
  ChevronRight,
  Check,
  Send,
  Paperclip,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';

/**
 * 💬 INBOX OPERACIONAL (Adworks Hub)
 * Gestão de threads com histórico completo e mensagens internas.
 */

export function Inbox() {
  const { data: deals, isLoading } = useDealsBoard();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  if (isLoading)
    return <div className="p-10 animate-pulse font-black text-slate-300">SYNCING INBOX...</div>;

  const currentThread = deals?.find((d: any) => d.id === selectedThread);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* 1. THREAD LIST (LEFT SIDE) */}
      <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-4">
            Mensagens
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar conversa..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {deals?.map((deal: any) => (
            <button
              key={deal.id}
              onClick={() => setSelectedThread(deal.id)}
              className={`w-full p-4 flex items-start gap-3 transition-all hover:bg-white text-left ${selectedThread === deal.id ? 'bg-white shadow-sm ring-1 ring-inset ring-slate-200' : ''}`}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs shrink-0 border border-white shadow-sm">
                {deal.company_name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2 uppercase tracking-tight">
                    {deal.company_name}
                  </span>
                  <span className="text-[9px] font-bold text-slate-300 whitespace-nowrap">
                    14:20
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate leading-snug">
                  Olá! O contrato já foi anexado no sistema.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="info" className="text-[8px] px-1.5 py-0">
                    OPERACIONAL
                  </Badge>
                  {deal.id === '1' && (
                    <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[9px] text-white font-black">
                      2
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. CHAT VIEW (RIGHT SIDE) */}
      <main className="flex-1 flex flex-col bg-white">
        {selectedThread ? (
          <>
            {/* CHAT HEADER */}
            <header className="p-4 px-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold text-xs">
                  {currentThread?.company_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {currentThread?.company_name}
                  </h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Online
                    agora
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-400">
                <button className="p-2 hover:bg-slate-50 rounded-lg">
                  <Filter className="w-4 h-4" />
                </button>
                <button className="p-2 hover:bg-slate-50 rounded-lg font-bold text-[10px] uppercase tracking-widest text-blue-600">
                  Ver Processo
                </button>
              </div>
            </header>

            {/* MESSAGE HISTORY */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FDFDFD]">
              <div className="flex justify-center">
                <Badge
                  variant="neutral"
                  className="bg-slate-100 text-slate-400 border-none text-[9px] font-bold tracking-[0.2em] px-4 py-1"
                >
                  HISTÓRICO COMPLETO ATIVADO
                </Badge>
              </div>

              {/* Recipient Message */}
              <div className="flex gap-4 items-end max-w-[80%]">
                <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="bg-slate-100 p-4 rounded-2xl rounded-bl-none">
                  <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    Poderia me confirmar se a etapa de CNPJ já foi protocolada? Recebi o e-mail mas
                    não vi no app.
                  </p>
                  <p className="text-[9px] font-bold text-slate-400 mt-2 uppercase">
                    Cliente • 10:15
                  </p>
                </div>
              </div>

              {/* Operator Message */}
              <div className="flex flex-col items-end gap-2">
                <div className="bg-blue-600 p-4 rounded-2xl rounded-br-none max-w-[80%] shadow-lg shadow-blue-100">
                  <p className="text-sm font-medium text-white leading-relaxed">
                    Com certeza! O protocolo foi feito às 09:30. Acabei de anexar o comprovante na
                    aba de documentos para você. Qualquer dúvida me avise.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-[9px] font-bold text-slate-300 uppercase">
                    Dan M. • 10:20
                  </span>
                  <Check className="w-3 h-3 text-blue-500" />
                </div>
              </div>

              {/* Internal Note */}
              <div className="flex justify-center">
                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl max-w-[70%] text-center">
                  <p className="text-[11px] font-bold text-amber-700 italic">
                    Nota Interna: Cliente está ansioso com o prazo do CNPJ. Priorizar protocolo na
                    prefeitura amanhã.
                  </p>
                  <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mt-1">
                    Visível apenas para o time
                  </p>
                </div>
              </div>
            </div>

            {/* INPUT AREA */}
            <footer className="p-6 border-t border-slate-100 bg-white">
              <div className="relative group">
                <textarea
                  placeholder="Responda ao cliente ou deixe uma nota interna..."
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pr-32 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none min-h-[100px] shadow-inner transition-all resize-none"
                />
                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <button
                    className="p-2.5 text-slate-300 hover:text-slate-600 transition-all"
                    title="Anexar arquivo"
                  >
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-200 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    Enviar <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-200 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-600 uppercase tracking-widest transition-colors">
                    Nota Interna
                  </span>
                </label>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                  Shift + Enter para enviar
                </span>
              </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-4">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <MessageSquare className="w-10 h-10" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">
                Selecione uma conversa
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                Gerencie o atendimento e mantenha o histórico completo das empresas em um só lugar.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
