import React, { useEffect, useState } from 'react';
import { FaStore, FaPills, FaUserPlus, FaExclamationTriangle } from 'react-icons/fa';
import { supabase } from '../../lib/supabase';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  isLoading?: boolean;
}

interface DashboardCounts {
  totalPharmacies: number;
  totalMedicines: number;
  pendingRequests: number;
  lowStockItems: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color, isLoading }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        {isLoading ? (
          <div className="animate-pulse h-8 w-16 bg-gray-200 rounded"></div>
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
      </div>
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  const [stats, setStats] = useState<DashboardCounts>({
    totalPharmacies: 0,
    totalMedicines: 0,
    pendingRequests: 0,
    lowStockItems: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch total pharmacies
      const { count: pharmacyCount } = await supabase
        .from('pharmacies')
        .select('*', { count: 'exact', head: true });

      // Fetch total medicines
      const { count: medicineCount } = await supabase
        .from('medicines')
        .select('*', { count: 'exact', head: true });

      // Fetch pending pharmacy requests
      const { count: requestCount } = await supabase
        .from('pharmacy_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Fetch low stock items (using inventory_logs)
      const { count: lowStockCount } = await supabase
        .from('inventory_logs')
        .select('medicine_id', { count: 'exact', head: true })
        .lt('quantity', 10); // Consider items with less than 10 units as low stock

      setStats({
        totalPharmacies: pharmacyCount || 0,
        totalMedicines: medicineCount || 0,
        pendingRequests: requestCount || 0,
        lowStockItems: lowStockCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Pharmacies"
        value={stats.totalPharmacies}
        icon={FaStore}
        color="bg-blue-500"
        isLoading={loading}
      />
      <StatsCard
        title="Total Medicines"
        value={stats.totalMedicines}
        icon={FaPills}
        color="bg-green-500"
        isLoading={loading}
      />
      <StatsCard
        title="Pending Requests"
        value={stats.pendingRequests}
        icon={FaUserPlus}
        color="bg-purple-500"
        isLoading={loading}
      />
      <StatsCard
        title="Low Stock Items"
        value={stats.lowStockItems}
        icon={FaExclamationTriangle}
        color="bg-yellow-500"
        isLoading={loading}
      />
    </div>
  );
};