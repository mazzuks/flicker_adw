import { useEffect, useState } from 'react';
import { useAuth } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import { Send, Paperclip, FileText, User, Clock } from 'lucide-react';

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
      setSelectedTicket(data[0].id);
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

  const getTicketLabel = (type: string) => {
    const labels: Record<string, string> = {
      TICKET_CNPJ: 'Abertura de CNPJ',
      TICKET_INPI: 'Registro de Marca',
      TICKET_FISCAL: 'Fiscal',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      NEW: 'Novo',
      WAITING_CLIENT: 'Aguardando você',
      READY: 'Pronto para iniciar',
      IN_PROGRESS: 'Em andamento',
      SUBMITTED: 'Enviado',
      PENDING_EXTERNAL: 'Aguardando órgão',
      APPROVED: 'Aprovado',
      REJECTED: 'Rejeitado',
      DONE: 'Concluído',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      NEW: 'bg-blue-100 text-blue-800',
      WAITING_CLIENT: 'bg-yellow-100 text-yellow-800',
      IN_PROGRESS: 'bg-purple-100 text-purple-800',
      DONE: 'bg-green-100 text-green-800',
      APPROVED: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
          <p className="text-gray-600 mt-1">Converse com a equipe Adworks</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhuma conversa ainda
          </h2>
          <p className="text-gray-600">
            Quando você iniciar processos como abertura de CNPJ ou registro de marca,
            as conversas aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  const currentTicket = tickets.find((t) => t.id === selectedTicket);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mensagens</h1>
        <p className="text-gray-600 mt-1">Converse com a equipe Adworks</p>
      </div>

      <div className="grid grid-cols-3 gap-6 h-[600px]">
        <div className="col-span-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900">Conversas</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket.id)}
                className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  selectedTicket === ticket.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">
                    {getTicketLabel(ticket.type)}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {getStatusLabel(ticket.status)}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(ticket.created_at).toLocaleDateString('pt-BR')}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {currentTicket && (
            <>
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">
                    {getTicketLabel(currentTicket.type)}
                  </h2>
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                      currentTicket.status
                    )}`}
                  >
                    {getStatusLabel(currentTicket.status)}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-500">Nenhuma mensagem ainda</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Envie uma mensagem para iniciar a conversa
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
                          className={`max-w-[70%] rounded-lg p-4 ${
                            isMe
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          {!isMe && (
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {msg.author?.full_name || 'Equipe Adworks'}
                              </span>
                            </div>
                          )}
                          <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                          <div
                            className={`flex items-center space-x-1 mt-2 text-xs ${
                              isMe ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>
                              {new Date(msg.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="p-4 border-t border-gray-200">
                <div className="flex items-end space-x-2">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Pressione Enter para enviar, Shift+Enter para nova linha
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
