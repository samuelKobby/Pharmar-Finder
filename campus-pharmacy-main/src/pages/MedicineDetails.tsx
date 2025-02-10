import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';
import { supabase } from '../lib/supabase';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  image: string;
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  latitude: number;
  longitude: number;
  available: boolean;
  image: string;
}

export const MedicineDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  useEffect(() => {
    fetchMedicineAndPharmacies();
  }, [id]);

  const fetchMedicineAndPharmacies = async () => {
    try {
      setLoading(true);
      
      // Fetch medicine details
      const { data: medicineData, error: medicineError } = await supabase
        .from('medicines')
        .select('*')
        .eq('id', id)
        .single();

      if (medicineError) throw medicineError;
      if (!medicineData) throw new Error('Medicine not found');

      setMedicine(medicineData);

      // Fetch pharmacies that have this medicine
      const { data: pharmacyData, error: pharmacyError } = await supabase
        .from('medicine_pharmacies')
        .select('pharmacy:pharmacies(*)')
        .eq('medicine_id', id);

      if (pharmacyError) throw pharmacyError;

      // Type assertion to ensure pharmacy data is an array of objects with pharmacy property
      const pharmacyDataArray = pharmacyData as Array<{ pharmacy: Pharmacy | null }>;
      
      const availablePharmacies = pharmacyDataArray
        .map(item => item.pharmacy)
        .filter((pharmacy): pharmacy is Pharmacy => pharmacy !== null);

      setPharmacies(availablePharmacies);
      if (availablePharmacies.length > 0) {
        setSelectedPharmacy(availablePharmacies[0].id);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDirectionsUrl = (pharmacy: Pharmacy) => {
    const coordinates = `${pharmacy.latitude},${pharmacy.longitude}`;
    const query = encodeURIComponent(`${pharmacy.name} ${pharmacy.location}`);
    return `https://www.google.com/maps/search/${query}/@${coordinates},17z`;
  };

  if (loading) return <div className="container mx-auto px-4 py-8 mt-16 text-center">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 mt-16 text-center text-red-500">{error}</div>;
  if (!medicine) return <div className="container mx-auto px-4 py-8 mt-16 text-center">Medicine not found</div>;

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Medicine Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <img
              src={medicine.image || 'https://via.placeholder.com/400x300'}
              alt={medicine.name}
              className="w-full rounded-lg object-cover shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <h1 className="text-3xl font-bold mb-4">{medicine.name}</h1>
            <p className="text-gray-600 mb-4 text-lg">{medicine.description}</p>
            <div className="flex flex-wrap gap-4 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                Category: {medicine.category}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                ${medicine.price.toFixed(2)} per {medicine.unit}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Pharmacy List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Available at {pharmacies.length} Pharmacies</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pharmacies.map((pharmacy) => (
            <div 
              key={pharmacy.id}
              className="bg-gray-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-xl mb-3">{pharmacy.name}</h3>
              <div className="space-y-2 text-gray-600 mb-4">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                  {pharmacy.location}
                </p>
                <p className="flex items-center">
                  <FaClock className="w-5 h-5 mr-2" />
                  {pharmacy.hours}
                </p>
                <p className="flex items-center">
                  <FaPhone className="w-5 h-5 mr-2" />
                  {pharmacy.phone}
                </p>
              </div>
              <a
                href={getDirectionsUrl(pharmacy)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                <FaMapMarkerAlt className="w-5 h-5 mr-2" />
                Get Directions
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
