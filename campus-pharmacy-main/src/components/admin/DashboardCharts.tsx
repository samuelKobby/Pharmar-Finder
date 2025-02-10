import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { supabase } from '../../lib/supabase';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface ChartData {
  categories: any[];
  stockTrends: any[];
  searchedMedicines: any[];
  pharmacyStats: any[];
}

export const DashboardCharts: React.FC = () => {
  const [data, setData] = useState<ChartData>({
    categories: [],
    stockTrends: [],
    searchedMedicines: [],
    pharmacyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      // Fetch medicine categories distribution
      const { data: categoriesData } = await supabase
        .from('medicines')
        .select('category')
        .not('category', 'is', null);

      const categoryCount = categoriesData?.reduce((acc: any, curr: any) => {
        acc[curr.category] = (acc[curr.category] || 0) + 1;
        return acc;
      }, {});

      const categories = Object.entries(categoryCount || {}).map(([name, value]) => ({
        name,
        value
      }));

      // Fetch stock trends (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const { data: stockData } = await supabase
        .from('medicines')
        .select('name, quantity, created_at')
        .gte('created_at', sevenDaysAgo.toISOString());

      const stockTrends = stockData?.map((item: any) => ({
        date: new Date(item.created_at).toLocaleDateString(),
        quantity: item.quantity
      }));

      // Fetch most searched medicines
      const { data: searchData } = await supabase
        .from('search_history')
        .select('medicine_name, count')
        .order('count', { ascending: false })
        .limit(5);

      const searchedMedicines = searchData?.map((item: any) => ({
        name: item.medicine_name,
        searches: item.count
      })) || [];

      // Fetch pharmacy availability statistics
      const { data: pharmacyData } = await supabase
        .from('pharmacies')
        .select('*');

      const totalPharmacies = pharmacyData?.length || 0;
      const activePharmacies = pharmacyData?.filter((p: any) => p.is_active).length || 0;
      const verifiedPharmacies = pharmacyData?.filter((p: any) => p.is_verified).length || 0;
      const newPharmacies = pharmacyData?.filter((p: any) => {
        const createdAt = new Date(p.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdAt >= thirtyDaysAgo;
      }).length || 0;

      const pharmacyStats = [
        { name: 'Total', value: totalPharmacies },
        { name: 'Active', value: activePharmacies },
        { name: 'Verified', value: verifiedPharmacies },
        { name: 'New (30d)', value: newPharmacies }
      ];

      setData({
        categories: categories || [],
        stockTrends: stockTrends || [],
        searchedMedicines,
        pharmacyStats
      });
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading charts...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Medicine Categories Distribution */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Medicine Categories</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data.categories}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.categories.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Trends */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Stock Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.stockTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="quantity"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Most Searched Medicines */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Most Searched Medicines</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.searchedMedicines}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="searches" fill="#00C49F" name="Search Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pharmacy Statistics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Pharmacy Statistics</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.pharmacyStats} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
