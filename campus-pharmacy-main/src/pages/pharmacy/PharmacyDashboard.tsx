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
  RefreshCw,
  ArrowLeft
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

interface Medicine {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  unit: string;
}

interface MedicineWithQuantity extends Medicine {
  quantity: number;
}

// Raw shape of data from Supabase join query
type SupabaseJoinRow = {
  quantity: any;
  medicines: {
    id: any;
    name: any;
    category: any;
    price: any;
    description: any;
    unit: any;
  }[];
}

interface DashboardStats {
  totalMedicines: number;
  inStock: number;
  outOfStock: number;
  lowStock: number;
  popularMedicines: MedicineWithQuantity[];
  categoryDistribution: Array<[string, number]>;
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
  const [medicines, setMedicines] = useState<MedicineWithQuantity[]>([]);
  const navigate = useNavigate();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  const handleBackToHome = (e: React.MouseEvent) => {
    e.preventDefault();
    logout(); // This will clear auth and navigate to home
  };

  useEffect(() => {
    if (!pharmacyId) {
      navigate('/', { replace: true });
      return;
    }

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

        // Format medicine data
        const medicineItems: MedicineWithQuantity[] = (data as SupabaseJoinRow[] || []).map(item => ({
          id: item.medicines[0]?.id,
          name: item.medicines[0]?.name,
          category: item.medicines[0]?.category,
          quantity: Number(item.quantity) || 0,
          price: Number(item.medicines[0]?.price) || 0,
          description: item.medicines[0]?.description,
          unit: item.medicines[0]?.unit
        }));

        setMedicines(medicineItems);

        // Calculate dashboard stats
        const stats: DashboardStats = {
          totalMedicines: medicineItems.length,
          inStock: medicineItems.filter(m => m.quantity > 0).length,
          outOfStock: medicineItems.filter(m => m.quantity === 0).length,
          lowStock: medicineItems.filter(m => m.quantity > 0 && m.quantity <= 10).length,
          popularMedicines: medicineItems
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, 5),
          categoryDistribution: Object.entries(
            medicineItems.reduce((acc, med) => {
              acc[med.category] = (acc[med.category] || 0) + 1;
              return acc;
            }, {} as Record<string, number>)
          )
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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <button
                onClick={handleBackToHome}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
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

                    // Format medicine data
                    const medicineItems: MedicineWithQuantity[] = (data as SupabaseJoinRow[] || []).map(item => ({
                      id: item.medicines[0]?.id,
                      name: item.medicines[0]?.name,
                      category: item.medicines[0]?.category,
                      quantity: Number(item.quantity) || 0,
                      price: Number(item.medicines[0]?.price) || 0,
                      description: item.medicines[0]?.description,
                      unit: item.medicines[0]?.unit
                    }));

                    setMedicines(medicineItems);

                    // Calculate dashboard stats
                    const stats: DashboardStats = {
                      totalMedicines: medicineItems.length,
                      inStock: medicineItems.filter(m => m.quantity > 0).length,
                      outOfStock: medicineItems.filter(m => m.quantity === 0).length,
                      lowStock: medicineItems.filter(m => m.quantity > 0 && m.quantity <= 10).length,
                      popularMedicines: medicineItems
                        .sort((a, b) => b.quantity - a.quantity)
                        .slice(0, 5),
                      categoryDistribution: Object.entries(
                        medicineItems.reduce((acc, med) => {
                          acc[med.category] = (acc[med.category] || 0) + 1;
                          return acc;
                        }, {} as Record<string, number>)
                      )
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
                  data={stats.popularMedicines.map((medicine, index) => ({ ...medicine, index }))}
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
                    data={stats.categoryDistribution.map(([name, value], index) => ({ name, value, index }))}
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
                          <tr key={medicine.id}>
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
    </div>
  );
};
