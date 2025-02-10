import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  created_at: string;
}

export const PharmacyNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const pharmacyId = localStorage.getItem('pharmacyId');
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('pharmacy_id', pharmacyId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const pharmacyId = localStorage.getItem('pharmacyId');
      const { error } = await supabase
        .from('notifications')
        .update({ 
          read: true,
          updated_at: new Date().toISOString()
        })
        .eq('pharmacy_id', pharmacyId)
        .eq('read', false);

      if (error) throw error;
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
        {notifications.some(n => !n.read) && (
          <button
            onClick={markAllAsRead}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Mark all as read
          </button>
        )}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center text-gray-500">No notifications</div>
        ) : (
          <div className="flow-root">
            <ul className="-mb-8">
              {notifications.map((notification, index) => (
                <li key={notification.id}>
                  <div className="relative pb-8">
                    {index !== notifications.length - 1 && (
                      <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    )}
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="min-w-0 flex-1 bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-1">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {notification.message}
                            </p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex flex-col items-end">
                            <span className="text-sm text-gray-500">
                              {formatDate(notification.created_at)}
                            </span>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                              >
                                Mark as read
                              </button>
                            )}
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="mt-1 text-sm text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
