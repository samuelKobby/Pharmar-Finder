import React, { useState } from 'react';
import { Sidebar } from '../../components/admin/Sidebar';
import { Header } from '../../components/admin/Header';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  React.useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${
        isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`} onClick={() => setIsSidebarOpen(false)} />
      
      <div className={`fixed inset-y-0 left-0 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 lg:z-0`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          adminName="Admin User" 
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            <DashboardStats />
            
            {/* Recent Activity Section */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Activity</h2>
              <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                {/* Add your activity list or table here */}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};