import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChartBar, FaPills, FaClinicMedical, FaShoppingCart, FaCog, FaSignOutAlt, FaTimes } from 'react-icons/fa';

interface SidebarProps {
  onClose?: () => void;
}

const menuItems = [
  { path: '/admin/dashboard', icon: FaChartBar, label: 'Dashboard' },
  { path: '/admin/products', icon: FaPills, label: 'Manage Products' },
  { path: '/admin/pharmacies', icon: FaClinicMedical, label: 'Manage Pharmacies' },
  { path: '/admin/orders', icon: FaShoppingCart, label: 'Orders/Bookings' },
  { path: '/admin/settings', icon: FaCog, label: 'Settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin';
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold">Admin Portal</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700 lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
        >
          <FaTimes className="w-5 h-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 ${
              location.pathname === item.path ? 'bg-gray-700 text-white' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="text-sm sm:text-base">{item.label}</span>
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700"
      >
        <FaSignOutAlt className="w-5 h-5 mr-3" />
        <span className="text-sm sm:text-base">Logout</span>
      </button>
    </div>
  );
};