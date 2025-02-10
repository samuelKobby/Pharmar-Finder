import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaClock, FaPhone } from 'react-icons/fa';
import { supabase } from '../lib/supabase';
import placeholderImage from '../assets/placeholder.svg';
import { MapPin, Clock, Phone, Package, Navigation } from 'lucide-react';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  phone: string;
  operating_hours: string;
  image_url: string;
  quantity: number;
  distance?: string; // For future use with geolocation
}

export const MedicineDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [loading, setLoading] = useState(true);

  const getDirectionsUrl = (address: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  useEffect(() => {
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
        setMedicine(medicineData);

        // Get all pharmacies that have this medicine in stock
        const { data: pharmacyData, error: pharmacyError } = await supabase
          .from('medicine_pharmacies')
          .select(`
            quantity,
            pharmacies (
              id,
              name,
              location,
              hours,
              phone,
              image
            )
          `)
          .eq('medicine_id', id)
          .gt('quantity', 0);

        console.log('Medicine:', medicineData);
        console.log('Raw pharmacy data:', pharmacyData);

        if (pharmacyError) throw pharmacyError;

        // Format pharmacy data
        const availablePharmacies = (pharmacyData || [])
          .filter(item => item.pharmacies && item.quantity > 0)
          .map(item => ({
            id: item.pharmacies.id,
            name: item.pharmacies.name,
            address: item.pharmacies.location,
            phone: item.pharmacies.phone,
            operating_hours: item.pharmacies.hours,
            image_url: item.pharmacies.image,
            quantity: item.quantity
          }))
          .sort((a, b) => b.quantity - a.quantity);

        console.log('Available pharmacies:', availablePharmacies);
        setPharmacies(availablePharmacies);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMedicineAndPharmacies();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Medicine not found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Medicine Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3">
            <img
              src={medicine?.image || placeholderImage}
              alt={medicine?.name}
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
          <div className="w-full md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{medicine?.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="text-lg font-medium">{medicine?.category}</p>
              </div>
              <div>
                <p className="text-gray-600">Price</p>
                <p className="text-lg font-medium">${medicine?.price}</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Description</p>
              <p className="text-gray-800">{medicine?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Pharmacies */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available at These Pharmacies</h2>
        {pharmacies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No pharmacies currently have this medicine in stock</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pharmacies.map((pharmacy) => (
              <div key={pharmacy.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={pharmacy.image_url || placeholderImage}
                      alt={pharmacy.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{pharmacy.name}</h3>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <p>{pharmacy.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">In Stock</p>
                    <p className="text-lg font-semibold text-green-600">{pharmacy.quantity} units</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Operating Hours</p>
                    <p className="text-gray-800">{pharmacy.operating_hours}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact</p>
                    <p className="text-gray-800">{pharmacy.phone}</p>
                  </div>
                  <div className="flex items-center justify-end">
                    <a
                      href={getDirectionsUrl(pharmacy.address)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Navigation className="h-4 w-4 mr-2" />
                      Get Directions
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
