import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Sidebar } from '../../components/admin/Sidebar';
import { Header } from '../../components/admin/Header';
import { DashboardStats } from '../../components/admin/DashboardStats';
import { DashboardCharts } from '../../components/admin/DashboardCharts';
import { Analytics } from './Analytics';
import { PharmacyManagement } from './Categories';
import { Inventory } from './Inventory';
import { Notifications } from './Notifications';
import { Users } from './Users';
import { Settings } from './Settings';
import { supabase } from '../../lib/supabase';

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

const DashboardHome: React.FC = () => (
  <div className="space-y-6">
    <DashboardStats />
    <DashboardCharts />
  </div>
);

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setAdminUser(null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('sb-access-token');
        localStorage.removeItem('sb-refresh-token');
        navigate('/admin/login');
      } else if (event === 'SIGNED_IN' && session) {
        await validateAdminUser(session.user.id);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate]);

  const validateAdminUser = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('No user found');
      }

      const adminData = {
        id: user.id,
        full_name: user.email?.split('@')[0] || 'Admin User',
        email: user.email || '',
        role: 'Admin'
      };

      setAdminUser(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    } catch (error) {
      console.error('Error validating admin user:', error);
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    }
  };

  const checkAuth = async () => {
    try {
      setLoading(true);

      // Get current user session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        throw new Error('No session found');
      }

      // Get or create admin data
      const adminData = {
        id: session.user.id,
        full_name: session.user.email?.split('@')[0] || 'Admin User',
        email: session.user.email || '',
        role: 'Admin'
      };

      setAdminUser(adminData);
      localStorage.setItem('adminUser', JSON.stringify(adminData));
    } catch (error) {
      console.error('Error checking auth:', error);
      setAdminUser(null);
      localStorage.removeItem('adminUser');
      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!adminUser) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 bg-gray-600 bg-opacity-75 z-20 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 transition duration-300 ease-in-out z-30 lg:z-0`}
      >
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          adminName={adminUser.full_name}
          onMenuClick={() => setIsSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="container mx-auto px-6 py-8">
            <Routes>
              <Route path="/" element={<DashboardHome />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/pharmacies" element={<PharmacyManagement />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};