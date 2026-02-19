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
} from 'lucide-react';

interface Ticket {
  id: string;
  type: string;
  status: string;
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

export function Inbox() {
  const { currentClientId, user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (currentClientId) {
      loadTickets();
    }
  }, [currentClientId]);

  useEffect(() => {
    if (selectedTicket) {
      loadMessages(selectedTicket);
    }
  }, [selectedTicket]);

  const loadTickets = async () => {
    if (!currentClientId) return;

    const { data } = await supabase
      .from('tickets')
      .select('*')
      .eq('client_id', currentClientId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setTickets(data);
      if (!selectedTicket) setSelectedTicket(data[0].id);
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
      .eq('visibility', 'CLIENT')
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket || !user) return;

    setSending(true);

    const { error } = await supabase.from('ticket_messages').insert({
      ticket_id: selectedTicket,
      author_user_id: user.id,
      message: newMessage,
      visibility: 'CLIENT',
    });

    if (!error) {
      setNewMessage('');
      loadMessages(selectedTicket);
    }

    setSending(false);
  };

  const getTicketTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      TICKET_CNPJ: 'CNPJ',
      TICKET_INPI: 'Marca',
      TICKET_FISCAL: 'Fiscal',
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-adworks-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-200px)] flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-adworks-dark tracking-tighter uppercase italic">
            Mensagens
          </h1>
          <p className="text-gray-500 font-medium">Suporte especializado para o seu processo.</p>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] shadow-adw-soft border border-gray-100 overflow-hidden flex">
        {/* Sidebar: Ticket List */}
        <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-adworks-gray/10">
          <div className="p-6 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar conversa..."
                className="w-full pl-9 pr-4 py-2 bg-adworks-gray border-none rounded-xl text-xs font-bold focus:ring-1 focus:ring-adworks-blue"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400 italic text-xs">
                Nenhuma conversa ativa
              </div>
            ) : (
              tickets.map((ticket) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket.id)}
                  className={`w-full p-6 text-left border-b border-gray-50 transition-all flex items-center justify-between group ${
                    selectedTicket === ticket.id ? 'bg-white shadow-sm' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        selectedTicket === ticket.id
                          ? 'bg-adworks-blue text-white'
                          : 'bg-white text-gray-400 border border-gray-100'
                      }`}
                    >
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                      <p
                        className={`text-xs font-black uppercase tracking-widest ${selectedTicket === ticket.id ? 'text-adworks-blue' : 'text-gray-400'}`}
                      >
                        {getTicketTypeLabel(ticket.type)}
                      </p>
                      <p className="font-bold text-adworks-dark text-sm leading-tight">
                        Suporte Adworks
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-4 h-4 transition-all ${selectedTicket === ticket.id ? 'text-adworks-blue translate-x-1' : 'text-gray-200'}`}
                  />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedTicket ? (
            <>
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center border border-green-100">
                    <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <h3 className="font-black text-adworks-dark text-sm uppercase tracking-tight italic">
                      Time de Especialistas
                    </h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">
                      Consultoria Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-adworks-gray rounded-3xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-400 font-medium text-sm">
                      Nenhuma mensagem ainda.
                      <br />
                      Inicie a conversa abaixo.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.author_user_id === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium shadow-sm ${
                            isMe
                              ? 'bg-adworks-blue text-white rounded-tr-none shadow-blue-100'
                              : 'bg-adworks-gray text-adworks-dark rounded-tl-none'
                          }`}
                        >
                          {msg.message}
                          <div
                            className={`text-[9px] mt-2 font-bold uppercase tracking-tighter ${isMe ? 'text-blue-200 text-right' : 'text-gray-400'}`}
                          >
                            {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-6 border-t border-gray-100 bg-adworks-gray/20">
                <div className="relative flex items-center gap-4">
                  <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-adworks-blue transition-all">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Escreva sua mensagem..."
                    className="flex-1 px-6 py-4 bg-white border border-gray-100 rounded-[1.5rem] focus:ring-2 focus:ring-adworks-blue focus:border-transparent font-medium shadow-sm outline-none"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="w-14 h-14 bg-adworks-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-50 disabled:scale-95 active:scale-90"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <div className="w-24 h-24 bg-adworks-gray rounded-[2rem] flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-gray-200" />
              </div>
              <h3 className="text-xl font-black text-adworks-dark uppercase italic tracking-tighter">
                Selecione uma conversa
              </h3>
              <p className="text-gray-400 max-w-xs mt-2">
                Escolha um dos seus processos ativos ao lado para falar com nossa equipe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
