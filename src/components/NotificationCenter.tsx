import { useEffect, useState, useRef } from 'react';
import { Bell, X, Check, FileText, AlertCircle, MessageSquare } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
  entity_type: string | null;
  entity_id: string | null;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      loadNotifications();

      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            loadNotifications();
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.read_at).length);
    }
  };

  const markAsRead = async (notificationId: string) => {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId);

    loadNotifications();
  };

  const markAllAsRead = async () => {
    setLoading(true);
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user?.id)
      .is('read_at', null);

    await loadNotifications();
    setLoading(false);
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setIsOpen(false);

    if (notification.entity_type === 'ticket') {
      navigate('/inbox');
    } else if (notification.entity_type === 'document') {
      navigate('/documents');
    } else if (notification.entity_type === 'onboarding_step') {
      navigate('/onboarding');
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'DOC_REQUIRED':
      case 'DOC_APPROVED':
        return FileText;
      case 'MESSAGE_RECEIVED':
        return MessageSquare;
      default:
        return AlertCircle;
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Agora';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m atrás`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h atrás`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-[600px] flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Notificações</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  disabled={loading}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Marcar todas como lidas
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      !notification.read_at ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          !notification.read_at ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            !notification.read_at ? 'text-blue-600' : 'text-gray-600'
                          }`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              !notification.read_at
                                ? 'text-gray-900'
                                : 'text-gray-700'
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read_at && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 ml-2 mt-1"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {notification.body}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {getTimeAgo(notification.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
