import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import {
  Send,
  Paperclip,
  FileText,
  User,
  Clock,
  MessageSquare,
  ChevronRight,
  Search,
  Building2,
  ExternalLink,
  MoreVertical,
  Shield,
} from 'lucide-react';

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
      .select(
        `
        *,
        author:author_user_id (
          id,
          email,
          full_name
        )
      `
      )
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

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto h-[calc(100vh-180px)] flex flex-col space-y-6 animate-in fade-in duration-500">
      <div className="flex items-end justify-between border-b border-adworks-border pb-6">
        <div>
          <h1 className="text-2xl font-bold text-adworks-dark tracking-tight">Correio Global</h1>
          <p className="text-adworks-muted text-sm mt-1">
            Central de atendimento Adworks (Nível Operacional).
          </p>
        </div>
      </div>

      <div className="flex-1 bg-adworks-surface rounded-adw-lg shadow-adw-card border border-adworks-border overflow-hidden flex">
        {/* Sidebar: All Client Tickets */}
        <div className="w-full md:w-80 lg:w-96 border-r border-adworks-border flex flex-col bg-adworks-gray">
          <div className="p-5 border-b border-adworks-border bg-adworks-surface/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adworks-muted" />
              <input
                type="text"
                placeholder="Filtrar por cliente..."
                className="w-full pl-9 pr-4 py-2 bg-adworks-surface border border-adworks-border rounded-lg text-xs font-medium focus:ring-1 focus:ring-adworks-blue outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-6 text-left border-b border-adworks-border transition-all flex items-center justify-between group relative ${
                  selectedTicketId === t.id
                    ? 'bg-adworks-surface shadow-sm'
                    : 'hover:bg-adworks-accent/30'
                }`}
              >
                {selectedTicketId === t.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-adworks-blue" />
                )}
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      selectedTicketId === t.id
                        ? 'bg-adworks-blue text-white'
                        : 'bg-adworks-accent text-adworks-muted'
                    }`}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`font-bold text-sm truncate ${selectedTicketId === t.id ? 'text-adworks-blue' : 'text-adworks-dark'}`}
                    >
                      {t.client?.fantasy_name || t.client?.name}
                    </p>
                    <p className="text-[9px] font-black text-adworks-muted uppercase tracking-widest mt-0.5">
                      {t.type.replace('TICKET_', '')}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 ${selectedTicketId === t.id ? 'text-adworks-blue' : 'text-adworks-border'}`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-adworks-surface relative">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-adworks-border flex items-center justify-between bg-adworks-surface/80 backdrop-blur-md sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-adworks-accent rounded-xl flex items-center justify-center text-adworks-blue border border-adworks-border shadow-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-adworks-dark text-base tracking-tight leading-none">
                      {selectedTicket.client?.fantasy_name || selectedTicket.client?.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 opacity-60">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <p className="text-[9px] font-black text-adworks-dark uppercase tracking-widest">
                        Atendimento Ativo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2.5 rounded-lg bg-adworks-accent text-adworks-muted hover:text-adworks-blue transition-all border border-adworks-border">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#F8FAFC]/50 custom-scrollbar">
                {messages.map((msg) => {
                  const isMe = msg.author_user_id === user?.id;
                  const isInternal = msg.visibility === 'INTERNAL';
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[70%] p-5 rounded-2xl text-sm font-medium shadow-sm relative ${
                          isInternal
                            ? 'bg-amber-50 border border-amber-200 text-amber-900 rounded-bl-none'
                            : isMe
                              ? 'bg-adworks-blue text-white rounded-br-none shadow-blue-500/10'
                              : 'bg-adworks-surface border border-adworks-border text-adworks-dark rounded-bl-none'
                        }`}
                      >
                        {isInternal && (
                          <div className="flex items-center gap-1.5 text-[8px] font-black uppercase text-amber-600 mb-2 border-b border-amber-200/50 pb-1.5 tracking-widest">
                            <Shield className="w-2.5 h-2.5" /> Nota Interna
                          </div>
                        )}
                        {msg.message}
                        <div
                          className={`text-[9px] mt-3 font-bold uppercase tracking-tighter ${isMe ? 'text-white/50' : 'text-adworks-muted'}`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 lg:p-8 border-t border-adworks-border bg-adworks-surface">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {}}
                      className="text-[9px] font-black uppercase tracking-widest bg-adworks-accent text-adworks-blue px-4 py-1.5 rounded-lg border border-adworks-border hover:bg-adworks-blue hover:text-white transition-all"
                    >
                      Cliente
                    </button>
                    <button
                      onClick={() => sendMessage('INTERNAL')}
                      className="text-[9px] font-black uppercase tracking-widest bg-adworks-gray text-adworks-muted px-4 py-1.5 rounded-lg border border-adworks-border hover:bg-amber-50 hover:text-amber-600 hover:border-amber-100 transition-all"
                    >
                      Interno
                    </button>
                  </div>
                  <div className="relative flex items-center gap-3">
                    <button className="w-12 h-12 rounded-xl bg-adworks-accent border border-adworks-border text-adworks-muted hover:text-adworks-blue transition-all shadow-sm flex items-center justify-center">
                      <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage('CLIENT')}
                      placeholder="Sua resposta rápida..."
                      className="flex-1 px-5 py-3.5 bg-adworks-accent/50 border border-adworks-border rounded-xl focus:ring-1 focus:ring-adworks-blue outline-none font-medium text-sm text-adworks-dark shadow-inner"
                    />
                    <button
                      onClick={() => sendMessage('CLIENT')}
                      disabled={sending || !newMessage.trim()}
                      className="w-14 h-12 bg-adworks-blue text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/10 hover:brightness-110 transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-20 text-center opacity-20 italic font-black text-adworks-dark uppercase tracking-[0.3em]">
              <MessageSquare className="w-20 h-20 mb-6" />
              Selecione uma conversa
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
