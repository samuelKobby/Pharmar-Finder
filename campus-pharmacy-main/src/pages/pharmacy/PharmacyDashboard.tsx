import React, { useEffect, useState } from 'react';
import { usePharmacyAuth } from '../../contexts/PharmacyAuthContext';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {
  Package2,
  AlertTriangle,
  TrendingUp,
  Search,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardStats {
  totalMedicines: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  popularMedicines: Array<{
    name: string;
    quantity: number;
    category: string;
  }>;
  categoryDistribution: Array<{
    name: string;
    value: number;
  }>;
}

interface Medicine {
  id: string;
  name: string;
  category: string;
  quantity: number;
  price: number;
  description: string;
  unit: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const PharmacyDashboard: React.FC = () => {
  const { pharmacyId, logout } = usePharmacyAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalMedicines: 0,
    inStock: 0,
    outOfStock: 0,
    lowStock: 0,
    popularMedicines: [],
    categoryDistribution: []
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setLoading(true);
        if (!pharmacyId) {
          navigate('/pharmacy/login', { replace: true });
          return;
        }

        // Get all medicine-pharmacy relationships for this pharmacy
        const { data, error: relationError } = await supabase
          .from('medicine_pharmacies')
          .select(`
            quantity,
            medicines (
              id,
              name,
              category,
              price,
              description,
              unit
            )
          `)
          .eq('pharmacy_id', pharmacyId);

        if (relationError) throw relationError;

        const medicines = (data || []).map(item => ({
          id: item.medicines.id,
          name: item.medicines.name,
          category: item.medicines.category,
          quantity: item.quantity,
          price: item.medicines.price,
          description: item.medicines.description,
          unit: item.medicines.unit
        }));

        setMedicines(medicines);

        // Calculate dashboard stats
        const stats: DashboardStats = {
          totalMedicines: medicines.length,
          inStock: medicines.filter(m => m.quantity > 0).length,
          outOfStock: medicines.filter(m => m.quantity === 0).length,
          lowStock: medicines.filter(m => m.quantity > 0 && m.quantity <= 10).length,
          popularMedicines: medicines
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5)
            .map(m => ({
              name: m.name,
              quantity: m.quantity,
              category: m.category
            })),
          categoryDistribution: Object.entries(
            medicines.reduce((acc, med) => {
              acc[med.category] = (acc[med.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          ).map(([name, value]) => ({ name, value }))
        };

        setStats(stats);
      } catch (error: any) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Error loading dashboard data');
      } finally {
        setLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate, pharmacyId]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-semibold">{label}</p>
          <p className="text-sm">
            Quantity: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Pharmacy Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your pharmacy's inventory and statistics
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => {
              setLoading(true);
              const initializeDashboard = async () => {
                try {
                  if (!pharmacyId) {
                    toast.error('No pharmacy ID found. Please login again.');
                    navigate('/pharmacy/login');
                    return;
                  }

                  // Get all medicine-pharmacy relationships for this pharmacy
                  const { data, error: relationError } = await supabase
                    .from('medicine_pharmacies')
                    .select(`
                      quantity,
                      medicines (
                        id,
                        name,
                        category,
                        price,
                        description,
                        unit
                      )
                    `)
                    .eq('pharmacy_id', pharmacyId);

                  if (relationError) throw relationError;

                  const medicines = (data || []).map(item => ({
                    id: item.medicines.id,
                    name: item.medicines.name,
                    category: item.medicines.category,
                    quantity: item.quantity,
                    price: item.medicines.price,
                    description: item.medicines.description,
                    unit: item.medicines.unit
                  }));

                  setMedicines(medicines);

                  // Calculate dashboard stats
                  const stats: DashboardStats = {
                    totalMedicines: medicines.length,
                    inStock: medicines.filter(m => m.quantity > 0).length,
                    outOfStock: medicines.filter(m => m.quantity === 0).length,
                    lowStock: medicines.filter(m => m.quantity > 0 && m.quantity <= 10).length,
                    popularMedicines: medicines
                      .sort((a, b) => b.quantity - a.quantity)
                      .slice(0, 5)
                      .map(m => ({
                        name: m.name,
                        quantity: m.quantity,
                        category: m.category
                      })),
                    categoryDistribution: Object.entries(
                      medicines.reduce((acc, med) => {
                        acc[med.category] = (acc[med.category] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([name, value]) => ({ name, value }))
                  };

                  setStats(stats);
                } catch (error: any) {
                  console.error('Error fetching dashboard data:', error);
                  toast.error('Error loading dashboard data');
                } finally {
                  setLoading(false);
                }
              };
              initializeDashboard();
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Medicines */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Medicines
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.totalMedicines}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* In Stock */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    In Stock
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.inStock}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Low Stock
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.lowStock}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Out of Stock
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.outOfStock}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Popular Medicines Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Popular Medicines</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.popularMedicines}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="quantity" fill="#0088FE" name="Quantity in Stock">
                  {stats.popularMedicines.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Category Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Popular Medicines Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Popular Medicines Details
          </h3>
          <div className="flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.popularMedicines.map((medicine, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {medicine.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medicine.category}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {medicine.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
