import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaChartBar,
  FaPills,
  FaClinicMedical,
  FaUserPlus,
  FaCog,
  FaSignOutAlt,
  FaTimes,
  FaList,
  FaClipboardList,
  FaChartLine,
  FaBell,
  FaUsers,
  FaStore
} from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

interface SidebarProps {
  onClose?: () => void;
}

const menuItems = [
  {
    label: 'Overview',
    items: [
      { path: '/admin', icon: FaChartBar, label: 'Dashboard' },
      { path: '/admin/analytics', icon: FaChartLine, label: 'Analytics' },
    ]
  },
  {
    label: 'Management',
    items: [
      { path: '/admin/pharmacies', icon: FaStore, label: 'Pharmacy Management' },
      { path: '/admin/inventory', icon: FaClipboardList, label: 'Inventory' },
    ]
  },
  {
    label: 'System',
    items: [
      { path: '/admin/notifications', icon: FaBell, label: 'Notifications' },
      { path: '/admin/users', icon: FaUsers, label: 'Users' },
      { path: '/admin/settings', icon: FaCog, label: 'Settings' },
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Portal</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              {section.label}
            </h3>
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 ${
                  location.pathname === item.path ? 'bg-gray-700 text-white border-l-4 border-blue-500' : ''
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors duration-200"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};