import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Send, Paperclip, FileText, User, Clock, MessageSquare, ChevronRight, Search, Building2, ExternalLink } from 'lucide-react';

interface Ticket {
  id: string;
  type: string;
  status: string;
  client_id: string;
  client?: {
    name: string;
    fantasy_name: string;
  };
  created_at: string;
}

interface Message {
  id: string;
  message: string;
  created_at: string;
  author_user_id: string;
  visibility: string;
  author?: {
    email: string;
    full_name: string;
  };
}

export function OperatorInbox() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadAllTickets();
  }, []);

  useEffect(() => {
    if (selectedTicketId) {
      loadMessages(selectedTicketId);
    }
  }, [selectedTicketId]);

  const loadAllTickets = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('*, client:client_id(name, fantasy_name)')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setTickets(data);
      if (!selectedTicketId) setSelectedTicketId(data[0].id);
    }
    setLoading(false);
  };

  const loadMessages = async (ticketId: string) => {
    const { data } = await supabase
      .from('ticket_messages')
      .select(`
        *,
        author:author_user_id (
          id,
          email,
          full_name
        )
      `)
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true });

    if (data) setMessages(data);
  };

  const sendMessage = async (visibility: 'CLIENT' | 'INTERNAL' = 'CLIENT') => {
    if (!newMessage.trim() || !selectedTicketId || !user) return;

    setSending(true);
    const { error } = await supabase.from('ticket_messages').insert({
      ticket_id: selectedTicketId,
      author_user_id: user.id,
      message: newMessage,
      visibility,
    });

    if (!error) {
      setNewMessage('');
      loadMessages(selectedTicketId);
    }
    setSending(false);
  };

  const selectedTicket = tickets.find(t => t.id === selectedTicketId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full h-[calc(100vh-180px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-[#2D3E50] tracking-tighter uppercase italic leading-none">Inbox Global</h1>
          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-2">Central de atendimento Adworks.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden flex">
        {/* Sidebar: All Client Tickets */}
        <div className="w-full md:w-96 border-r border-gray-100 flex flex-col bg-[#F8FAFC]">
          <div className="p-6 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Filtrar por cliente..." className="w-full pl-9 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-bold focus:ring-1 focus:ring-adworks-blue outline-none" />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-6 text-left border-b border-gray-50 transition-all flex items-center justify-between group ${
                  selectedTicketId === t.id ? 'bg-white shadow-lg z-10' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-4">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                     selectedTicketId === t.id ? 'bg-adworks-blue text-white shadow-lg shadow-blue-500/20' : 'bg-white text-gray-400 border border-gray-100'
                   }`}>
                      <Building2 className="w-6 h-6" />
                   </div>
                   <div>
                      <p className="font-black text-[#2D3E50] text-sm uppercase italic leading-tight group-hover:text-adworks-blue">{t.client?.fantasy_name || t.client?.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{t.type.replace('TICKET_', '')}</p>
                   </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedTicketId === t.id ? 'text-adworks-blue translate-x-1' : 'text-gray-200'} transition-all`} />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-blue-50 rounded-2xl flex items-center justify-center text-adworks-blue shadow-sm">
                       <User className="w-6 h-6" />
                    </div>
                    <div>
                       <h3 className="font-black text-[#2D3E50] text-base uppercase tracking-tighter italic">{selectedTicket.client?.fantasy_name || selectedTicket.client?.name}</h3>
                       <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Canal: Portal do Cliente</p>
                       </div>
                    </div>
                 </div>
                 <button className="bg-adworks-gray p-3 rounded-xl text-gray-400 hover:text-adworks-blue transition-all"><ExternalLink className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.map((msg) => {
                  const isMe = msg.author_user_id === user?.id;
                  const isInternal = msg.visibility === 'INTERNAL';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] p-5 rounded-[2rem] text-sm font-medium shadow-sm relative ${
                        isInternal ? 'bg-amber-50 border border-amber-100 text-amber-900' :
                        isMe ? 'bg-adworks-blue text-white rounded-tr-none' : 'bg-adworks-gray text-[#2D3E50] rounded-tl-none'
                      }`}>
                        {isInternal && <span className="absolute -top-3 left-4 bg-amber-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Nota Interna 🔒</span>}
                        {msg.message}
                        <div className={`text-[9px] mt-3 font-black uppercase tracking-widest ${isMe ? 'text-white/60 text-right' : 'text-gray-400'}`}>
                          {msg.author?.full_name?.split(' ')[0]} • {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 border-t border-gray-100 bg-[#F8FAFC]">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2 mb-2">
                     <button className="text-[9px] font-black uppercase tracking-widest bg-adworks-blue/10 text-adworks-blue px-4 py-1.5 rounded-full border border-adworks-blue/20">Responder Cliente</button>
                     <button className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-400 px-4 py-1.5 rounded-full hover:bg-amber-50 hover:text-amber-600 transition-all">Nota Interna</button>
                  </div>
                  <div className="relative flex items-center gap-4">
                    <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-300 hover:text-adworks-blue transition-all shadow-sm">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder="Responda ao cliente aqui..."
                      className="flex-1 px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-adworks-blue outline-none font-bold text-sm text-[#2D3E50] shadow-inner"
                    />
                    <button
                      onClick={() => sendMessage('CLIENT')}
                      disabled={sending || !newMessage.trim()}
                      className="w-16 h-14 bg-adworks-blue text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 hover:brightness-110 transition-all active:scale-90"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-30">
               <MessageSquare className="w-20 h-20 mb-6" />
               <h3 className="text-xl font-black italic uppercase tracking-tighter">Selecione um Atendimento</h3>
               <p className="text-xs font-bold uppercase tracking-widest mt-2">Fila Global de Suporte</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
