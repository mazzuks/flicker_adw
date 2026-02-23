import {
  Search,
  MessageSquare,
  Check,
  Send,
  Paperclip,
  ShieldCheck,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

/**
 * 💬 INBOX OPERACIONAL (Final 2.0)
 * Real-time chat with Supabase + Internal Notes + Full History.
 */

export function Inbox() {
  const { profile } = useAuth();
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Threads
  useEffect(() => {
    loadThreads();
    const subscription = supabase
      .channel('threads_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages_threads' }, () => loadThreads())
      .subscribe();
    return () => { subscription.unsubscribe(); };
  }, []);

  // 2. Fetch Messages for selected thread
  useEffect(() => {
    if (!selectedThreadId) return;
    loadMessages();
    markAsRead(selectedThreadId);

    const subscription = supabase
      .channel(`chat_${selectedThreadId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `thread_id=eq.${selectedThreadId}`
      }, (payload) => {
        setMessages(prev => [...prev, payload.new]);
        scrollToBottom();
      })
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [selectedThreadId]);

  const loadThreads = async () => {
    const { data } = await supabase
      .from('messages_threads')
      .select('*, companies(name)')
      .order('last_message_at', { ascending: false });
    setThreads(data || []);
    setLoading(false);
  };

  const loadMessages = async () => {
    if (!selectedThreadId) return;
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('thread_id', selectedThreadId)
      .order('created_at', { ascending: true });
    setMessages(data || []);
    setTimeout(scrollToBottom, 100);
  };

  const markAsRead = async (id: string) => {
    await supabase.rpc('mark_thread_read' as any, { p_thread_id: id });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedThreadId) return;
    const body = newMessage;
    setNewMessage('');
    
    const { error } = await supabase.rpc('send_chat_message' as any, {
      p_thread_id: selectedThreadId,
      p_body: body,
      p_is_internal: isInternal
    });

    if (error) console.error("Error sending message:", error);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return <div className="p-10 animate-pulse font-black text-slate-300 italic uppercase">Carregando Conversas...</div>;

  const currentThread = threads.find(t => t.id === selectedThreadId);

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-500">
      
      {/* 1. THREAD LIST */}
      <aside className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/30 shrink-0">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-4 italic">Inbox</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {threads.map((t) => (
            <button 
              key={t.id}
              onClick={() => setSelectedThreadId(t.id)}
              className={`w-full p-5 flex items-start gap-4 transition-all hover:bg-white text-left group ${selectedThreadId === t.id ? 'bg-white shadow-sm ring-1 ring-inset ring-slate-200' : ''}`}
            >
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xs shrink-0 shadow-lg shadow-blue-100 group-hover:scale-110 transition-all">
                {Array.isArray(t.companies) ? t.companies[0]?.name?.charAt(0) : t.companies?.name?.charAt(0) || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-900 truncate pr-2 uppercase tracking-tight italic">
                    {Array.isArray(t.companies) ? t.companies[0]?.name : t.companies?.name}
                  </span>
                  {t.unread_count_operator > 0 && <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] text-white font-black">{t.unread_count_operator}</div>}
                </div>
                <p className="text-[10px] text-slate-400 truncate font-medium">{t.last_message_preview || 'Inicie uma conversa...'}</p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* 2. CHAT AREA */}
      <main className="flex-1 flex flex-col bg-white">
        {selectedThreadId ? (
          <>
            <header className="p-5 px-8 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                    {Array.isArray(currentThread?.companies) ? currentThread.companies[0]?.name?.charAt(0) : currentThread?.companies?.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic leading-none">
                      {Array.isArray(currentThread?.companies) ? currentThread.companies[0]?.name : currentThread?.companies?.name}
                    </h3>
                    <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1.5 mt-1.5 leading-none">
                       <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Canal de Suporte Ativo
                    </p>
                  </div>
               </div>
            </header>

            {/* MESSAGE HISTORY */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FDFDFD]">
               <div className="flex justify-center"><Badge variant="neutral" className="bg-slate-100 text-slate-400 border-none text-[8px] font-black tracking-[0.2em] px-4 py-1 uppercase italic leading-none">Criptografia Ponta-a-Ponta</Badge></div>

               {messages.map((m) => {
                 const isMine = m.author_id === profile?.id;
                 return (
                   <div key={m.id} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'} gap-1 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <div className={`p-4 px-5 rounded-2xl max-w-[70%] shadow-sm border ${
                        m.is_internal 
                          ? 'bg-amber-50 border-amber-100 text-amber-900 italic' 
                          : isMine 
                            ? 'bg-blue-600 border-blue-500 text-white shadow-blue-100' 
                            : 'bg-white border-slate-100 text-slate-700'
                      } ${isMine ? 'rounded-tr-none' : 'rounded-tl-none'}`}>
                         {m.is_internal && <div className="flex items-center gap-2 mb-2 text-[8px] font-black uppercase text-amber-500 tracking-widest border-b border-amber-200/50 pb-1 leading-none"><ShieldCheck className="w-3 h-3" /> Nota Interna (Privado)</div>}
                         <p className="text-[13px] font-medium leading-relaxed">{m.body}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-1">
                         <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter leading-none">
                            {new Date(m.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                         </span>
                         {isMine && <Check className="w-2.5 h-2.5 text-blue-400" />}
                      </div>
                   </div>
                 );
               })}
               <div ref={messagesEndRef} />
            </div>

            {/* INPUT AREA */}
            <footer className="p-6 border-t border-slate-100 bg-white">
               <div className={`relative transition-all rounded-[2rem] border-2 ${isInternal ? 'border-amber-200 bg-amber-50/30' : 'border-slate-100 bg-slate-50'}`}>
                  <textarea 
                    placeholder={isInternal ? "Escreva uma nota interna para o time..." : "Responda ao cliente..."}
                    className="w-full bg-transparent p-5 pr-32 text-sm font-medium focus:outline-none min-h-[100px] resize-none"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  />
                  <div className="absolute right-4 bottom-4 flex items-center gap-3">
                     <button className="p-2 text-slate-300 hover:text-blue-600 transition-all"><Paperclip className="w-5 h-5" /></button>
                     <button 
                       onClick={sendMessage}
                       className={`px-6 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-2 ${isInternal ? 'bg-amber-500 text-white shadow-amber-100' : 'bg-blue-600 text-white shadow-blue-100'} hover:scale-105 active:scale-95`}
                     >
                        Enviar <Send className="w-3 h-3" />
                     </button>
                  </div>
               </div>
               <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group px-2">
                     <input 
                       type="checkbox" 
                       checked={isInternal}
                       onChange={(e) => setIsInternal(e.target.checked)}
                       className="w-4 h-4 rounded-lg border-slate-200 text-amber-500 focus:ring-amber-500 transition-all" 
                     />
                     <div className="flex flex-col">
                        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isInternal ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'} leading-none`}>Nota Interna</span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tight mt-1 leading-none">O cliente não verá esta mensagem</span>
                     </div>
                  </label>
               </div>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-20 text-center space-y-6">
             <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-inner group transition-all">
                <MessageSquare className="w-12 h-12 group-hover:rotate-12 transition-transform" />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic leading-none">Selecione uma conversa</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto mt-4">
                   Central de Atendimento e Histórico Global Adworks.
                </p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
