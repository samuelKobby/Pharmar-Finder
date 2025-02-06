import React from 'react';
import { FaBell, FaCheck, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Low Stock Alert',
    message: 'Paracetamol 500mg is running low on stock (5 units remaining)',
    type: 'warning',
    time: '2 hours ago',
    read: false
  },
  {
    id: 2,
    title: 'New Pharmacy Added',
    message: 'Campus Pharmacy has been successfully registered',
    type: 'success',
    time: '5 hours ago',
    read: false
  },
  {
    id: 3,
    title: 'System Update',
    message: 'New features have been added to the admin dashboard',
    type: 'info',
    time: '1 day ago',
    read: true
  }
];

export const Notifications: React.FC = () => {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <FaCheck className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <FaExclamationTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <FaTimes className="h-5 w-5 text-red-500" />;
      default:
        return <FaBell className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50';
    switch (type) {
      case 'success':
        return 'bg-green-50';
      case 'warning':
        return 'bg-yellow-50';
      case 'error':
        return 'bg-red-50';
      default:
        return 'bg-blue-50';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <p className="text-gray-600 mt-1">Stay updated with important alerts and messages</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaBell className="text-blue-500" />
            <span className="font-medium">All Notifications</span>
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {notifications.filter(n => !n.read).length} new
            </span>
          </div>
          <button className="text-sm text-blue-500 hover:text-blue-700">
            Mark all as read
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 ${getNotificationBg(notification.type, notification.read)} hover:bg-gray-50 transition-colors duration-150`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {notifications.length === 0 && (
          <div className="p-8 text-center">
            <FaBell className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              You're all caught up! Check back later for new updates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
