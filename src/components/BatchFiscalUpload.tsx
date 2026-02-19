import { useState } from 'react';
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Table,
  CheckSquare,
  ArrowRight,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

interface PendingUpload {
  id: string;
  file: File;
  clientName: string;
  clientId?: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
}

export function BatchFiscalUpload({
  onClose,
  onComplete,
}: {
  onClose: () => void;
  onComplete: () => void;
}) {
  const [uploads, setUploads] = useState<PendingUpload[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleFileSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const newUploads: PendingUpload[] = [];

    for (const file of files) {
      // Heurística simples: tentar encontrar o nome do cliente no nome do arquivo
      // Ex: "Guia_DAS_Sabor_e_Arte_Fev.pdf"
      const fileName = file.name.toLowerCase();

      // Buscar clientes no banco para tentar o match
      const { data: clients } = await supabase.from('clients').select('id, name, fantasy_name');

      const match = clients?.find(
        (c) =>
          fileName.includes(c.name.toLowerCase().split(' ')[0]) ||
          (c.fantasy_name && fileName.includes(c.fantasy_name.toLowerCase().split(' ')[0]))
      );

      newUploads.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        clientName: match ? match.fantasy_name || match.name : 'Desconhecido',
        clientId: match?.id,
        status: 'pending',
      });
    }

    setUploads((prev) => [...prev, ...newUploads]);
  };

  const startUpload = async () => {
    setProcessing(true);

    for (const item of uploads) {
      if (item.status === 'success' || !item.clientId) continue;

      setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: 'uploading' } : u)));

      try {
        const fileExt = item.file.name.split('.').pop();
        const storagePath = `${item.clientId}/fiscal/${Date.now()}_${item.file.name}`;

        // 1. Upload para Storage
        const { error: storageError } = await supabase.storage
          .from('documents')
          .upload(storagePath, item.file);

        if (storageError) throw storageError;

        // 2. Criar Ticket Fiscal e Notificar
        const { error: ticketError } = await supabase.from('tickets').insert({
          client_id: item.clientId,
          type: 'TICKET_FISCAL',
          status: 'DONE', // Já entra como concluído pois é a entrega da guia
          priority: 'NORMAL',
          data_json: {
            document_url: storagePath,
            file_name: item.file.name,
            month_ref: 'FEVEREIRO/2026',
          },
        });

        if (ticketError) throw ticketError;

        setUploads((prev) => prev.map((u) => (u.id === item.id ? { ...u, status: 'success' } : u)));
      } catch (err: any) {
        setUploads((prev) =>
          prev.map((u) => (u.id === item.id ? { ...u, status: 'error', error: err.message } : u))
        );
      }
    }

    setProcessing(false);
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 bg-adworks-dark/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-10 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden border border-white/20">
        {/* Header */}
        <div className="p-8 lg:p-12 border-b border-gray-100 flex items-center justify-between bg-adworks-gray/30">
          <div>
            <span className="bg-adworks-blue text-white px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase">
              Operação de Lote
            </span>
            <h2 className="text-3xl font-black text-adworks-dark mt-3 italic uppercase tracking-tighter">
              Upload de Guias DAS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          {uploads.length === 0 ? (
            <label className="h-full border-4 border-dashed border-gray-100 rounded-[2.5rem] flex flex-col items-center justify-center group hover:border-adworks-blue/30 hover:bg-blue-50/30 transition-all cursor-pointer">
              <input
                type="file"
                multiple
                accept=".pdf"
                className="hidden"
                onChange={handleFileSelection}
              />
              <div className="w-20 h-20 bg-adworks-gray rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="w-10 h-10 text-gray-300 group-hover:text-adworks-blue" />
              </div>
              <p className="text-xl font-black text-adworks-dark uppercase italic">
                Arraste as guias aqui
              </p>
              <p className="text-sm font-bold text-gray-400 mt-2 uppercase tracking-widest text-center max-w-xs">
                Selecione vários PDFs. O sistema tentará identificar os clientes automaticamente.
              </p>
            </label>
          ) : (
            <div className="space-y-4">
              {uploads.map((item) => (
                <div
                  key={item.id}
                  className="bg-adworks-gray/50 p-6 rounded-3xl border border-transparent hover:border-gray-200 transition-all flex items-center justify-between gap-6"
                >
                  <div className="flex items-center gap-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                        item.status === 'success'
                          ? 'bg-green-50 text-green-500'
                          : item.status === 'error'
                            ? 'bg-red-50 text-red-500'
                            : 'bg-white text-adworks-blue'
                      }`}
                    >
                      <FileText className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-adworks-dark text-sm leading-tight truncate max-w-[200px] md:max-w-md">
                        {item.file.name}
                      </h4>
                      <p
                        className={`text-[10px] font-black uppercase tracking-widest mt-1 ${item.clientId ? 'text-green-600' : 'text-orange-500'}`}
                      >
                        {item.clientId
                          ? `Destino: ${item.clientName}`
                          : 'Cliente não identificado ⚠️'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.status === 'uploading' && (
                      <Loader2 className="w-5 h-5 text-adworks-blue animate-spin" />
                    )}
                    {item.status === 'success' && (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    )}
                    {item.status === 'error' && (
                      <AlertCircle className="w-6 h-6 text-red-500" title={item.error} />
                    )}
                    {item.status === 'pending' && (
                      <button
                        onClick={() => setUploads((prev) => prev.filter((u) => u.id !== item.id))}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <button
                className="w-full py-6 border-2 border-dashed border-gray-200 rounded-3xl text-[10px] font-black text-gray-400 uppercase tracking-widest hover:border-adworks-blue hover:text-adworks-blue transition-all"
                onClick={() => document.querySelector('input')?.click()}
              >
                + Adicionar mais arquivos
                <input
                  type="file"
                  multiple
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileSelection}
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 lg:p-12 border-t border-gray-100 bg-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Status da Operação
            </p>
            <p className="text-sm font-bold text-adworks-dark uppercase italic">
              {uploads.length} arquivos prontos •{' '}
              {uploads.filter((u) => u.status === 'success').length} processados
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <button
              onClick={onClose}
              className="flex-1 md:flex-none px-10 py-5 text-xs font-black uppercase text-gray-400 tracking-widest"
            >
              Cancelar
            </button>
            <button
              onClick={startUpload}
              disabled={
                processing || uploads.length === 0 || uploads.every((u) => u.status === 'success')
              }
              className="flex-1 md:flex-none bg-adworks-dark text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-adworks-blue transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {processing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <CheckSquare className="w-5 h-5" />
              )}
              INICIAR PROCESSAMENTO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
