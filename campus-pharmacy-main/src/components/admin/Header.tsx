import React from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';

interface HeaderProps {
  adminName: string;
  onMenuClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ adminName, onMenuClick }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="flex justify-between items-center px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <button 
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-gray-500 lg:hidden"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 ml-2 sm:ml-0">Admin Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800">
            <FaBell className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center space-x-2">
            <FaUserCircle className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
            <span className="text-gray-800 font-medium hidden sm:inline">Welcome, {adminName}</span>
          </div>
        </div>
      </div>
    </header>
  );
};