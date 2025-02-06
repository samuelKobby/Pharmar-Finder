import React from 'react';
import { FaChartBar, FaUsers, FaPills, FaClinicMedical } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold mt-2">{value}</h3>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">{icon}</div>
    </div>
    <div className="mt-4">
      <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
  </div>
);

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Analytics Overview</h2>
        <p className="text-gray-600 mt-1">Monitor key metrics and performance indicators</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value="2,453"
          change="+12.5% from last month"
          icon={<FaUsers className="h-6 w-6 text-blue-500" />}
          trend="up"
        />
        <StatCard
          title="Active Pharmacies"
          value="48"
          change="+3 new this month"
          icon={<FaClinicMedical className="h-6 w-6 text-blue-500" />}
          trend="up"
        />
        <StatCard
          title="Total Medicines"
          value="1,256"
          change="+85 new items"
          icon={<FaPills className="h-6 w-6 text-blue-500" />}
          trend="up"
        />
        <StatCard
          title="Daily Searches"
          value="892"
          change="-2.3% from yesterday"
          icon={<FaChartBar className="h-6 w-6 text-blue-500" />}
          trend="down"
        />
      </div>

      {/* Add more analytics sections here */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <p className="text-gray-600">Coming soon: Activity charts and detailed analytics</p>
        </div>
      </div>
    </div>
  );
};