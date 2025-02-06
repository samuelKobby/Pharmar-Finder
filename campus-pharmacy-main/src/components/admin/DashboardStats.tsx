import React from 'react';
import { FaStore, FaPills, FaShoppingCart, FaExclamationTriangle } from 'react-icons/fa';

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex items-center">
      <div className={`rounded-full p-3 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="ml-4">
        <h3 className="text-lg font-medium text-gray-600">{title}</h3>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

export const DashboardStats: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Total Pharmacies"
        value={12}
        icon={FaStore}
        color="bg-blue-500"
      />
      <StatsCard
        title="Total Products"
        value={156}
        icon={FaPills}
        color="bg-green-500"
      />
      <StatsCard
        title="Total Orders"
        value={89}
        icon={FaShoppingCart}
        color="bg-purple-500"
      />
      <StatsCard
        title="Pending Updates"
        value={5}
        icon={FaExclamationTriangle}
        color="bg-yellow-500"
      />
    </div>
  );
};