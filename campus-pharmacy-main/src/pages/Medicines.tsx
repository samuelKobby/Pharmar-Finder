import React, { useState } from 'react';
import { medicines, pharmacies } from '../data/sampleData';

interface Medicine {
  id: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  price: number;
  available: boolean;
  image: string;
  pharmacies: string[];
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  hours: string;
  phone: string;
  available: boolean;
  image: string;
}

export const Medicines: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get unique categories from medicines
  const categories = [...new Set(medicines.map(m => m.category))];

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || medicine.category === selectedCategory;
    const matchesPrice = (!minPrice || medicine.price >= Number(minPrice)) &&
                        (!maxPrice || medicine.price <= Number(maxPrice));
    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Get pharmacy details for a medicine
  const getPharmacyDetails = (pharmacyIds: string[]) => {
    return pharmacies.filter(pharmacy => pharmacyIds.includes(pharmacy.id));
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {/* Filters Section */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Search Medicines</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Search Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search medicines..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filters */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Min Price
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min price..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Price
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max price..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMedicines.map(medicine => {
          const availablePharmacies = getPharmacyDetails(medicine.pharmacies);
          
          return (
            <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={medicine.image || 'https://via.placeholder.com/400x300'}
                alt={medicine.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{medicine.name}</h3>
                <p className="text-gray-600 mb-2">{medicine.description}</p>
                <p className="text-green-600 font-semibold mb-2">
                  ${medicine.price.toFixed(2)} per {medicine.unit}
                </p>
                <p className="text-blue-600 mb-1">Category: {medicine.category}</p>
                
                {/* Available Pharmacies */}
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-semibold mb-2">Available at:</h4>
                  <div className="space-y-3">
                    {availablePharmacies.map(pharmacy => (
                      <div key={pharmacy.id} className="text-gray-600 bg-gray-50 p-3 rounded">
                        <p className="font-medium mb-1"> {pharmacy.name}</p>
                        <p className="text-sm mb-1"> {pharmacy.location}</p>
                        <p className="text-sm mb-1"> {pharmacy.hours}</p>
                        <p className="text-sm"> {pharmacy.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No medicines found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};
