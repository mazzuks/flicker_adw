import React, { useState, useEffect } from 'react';
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
  Upload,
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { storageService } from '../services/storageService';

interface DealDrawerProps {
  dealId: string | null;
  isOpen: boolean;
  onClose: () => void;
  dealData?: any;
}

export function DealDrawer({ dealId, isOpen, onClose, dealData }: DealDrawerProps) {
  const [activeTab, setActiveTab] = useState<'checklist' | 'docs' | 'messages' | 'audit'>(
    'checklist'
  );
  const [docs, setDocs] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  // Carregar documentos reais quando o drawer abrir
  useEffect(() => {
    if (isOpen && dealId && activeTab === 'docs') {
      loadDocs();
    }
  }, [isOpen, dealId, activeTab]);

  const loadDocs = async () => {
    try {
      if (!dealId) return;
      const data = await storageService.getDocs(dealId);
      setDocs(data || []);
    } catch (e) {
      console.error('Erro ao carregar documentos:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !dealId || !dealData?.account_id) return;

    setUploading(true);
    try {
      await storageService.uploadDoc(file, dealData.account_id, dealId);
      await loadDocs();
    } catch (err) {
      console.error('Erro no upload:', err);
    } finally {
      setUploading(false);
    }
  };

  if (!dealId) return null;

  const tabs = [
    { id: 'checklist', label: 'Checklist', icon: CheckCircle2 },
    { id: 'docs', label: 'Documentos', icon: FileText },
    { id: 'messages', label: 'Mensagens', icon: MessageSquare },
    { id: 'audit', label: 'Auditoria', icon: History },
  ] as const;

  return (
    <>
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-[998] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-[999] transform transition-transform duration-500 ease-out border-l border-slate-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="p-6 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="info"
                className="bg-blue-50 text-blue-600 border-blue-100 font-black text-[10px] tracking-widest uppercase italic"
              >
                {dealData?.stage_key || 'ETAPA'}
              </Badge>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">
                {dealData?.company_name || 'EMPRESA'}
              </span>
            </div>
            <div className="flex items-center gap-2">
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
            <div className="flex items-center gap-2 text-slate-500">
              <Calendar className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                SLA: {dealData?.sla_status === 'breached' ? 'ATRASADO' : 'EM DIA'}
              </span>
            </div>
          </div>
        </header>

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

        <main className="flex-1 overflow-y-auto p-6 bg-[#FDFDFD]">
          {activeTab === 'checklist' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 italic">
                Fila de Execução
              </h4>
              <div className="space-y-2">
                {[
                  { id: '1', title: 'Validar documentos dos sócios', done: true },
                  { id: '2', title: 'Consultar viabilidade do endereço', done: false },
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
              <label className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer block relative">
                <input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
                {uploading ? (
                  <RefreshCw className="w-10 h-10 text-blue-600 mx-auto mb-3 animate-spin" />
                ) : (
                  <Upload className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                )}
                <p className="text-sm font-bold text-slate-600 uppercase tracking-tight">
                  {uploading ? 'Enviando...' : 'Arraste arquivos aqui'}
                </p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                  PDF, JPG, PNG (Max 10MB)
                </p>
              </label>

              <div className="space-y-3">
                {docs.map((doc, i) => (
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
                          {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-blue-600 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                {docs.length === 0 && !uploading && (
                  <p className="text-center text-xs text-slate-400 italic py-10">
                    Nenhum documento anexado ainda.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Outras abas simplificadas para o MVP */}
          {activeTab === 'messages' && (
            <div className="p-10 text-center text-xs text-slate-400 italic">
              Centralize aqui a conversa direta com o cliente deste processo.
            </div>
          )}
          {activeTab === 'audit' && (
            <div className="p-10 text-center text-xs text-slate-400 italic">
              Timeline real de cada ação tomada neste card.
            </div>
          )}
        </main>

        <footer className="p-6 border-t border-slate-100 bg-white flex items-center justify-end gap-3 flex-shrink-0">
          <Button variant="secondary">Mover Etapa</Button>
          <Button variant="primary" className="bg-blue-600 shadow-lg shadow-blue-200">
            Próxima Etapa
          </Button>
        </footer>
      </aside>
    </>
  );
}

function RefreshCw(props: any) {
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
      className="lucide lucide-refresh-cw"
    >
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M3 21v-5h5" />
    </svg>
  );
}
