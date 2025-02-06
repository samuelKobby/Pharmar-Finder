import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '../../data/sampleData';

export const FeaturedProducts: React.FC = () => {
  // Get first 6 medicines from all categories combined
  const featuredMedicines = categories
    .flatMap(category => category.medicines)
    .slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Products</h2>
          <Link
            to="/medicines"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMedicines.map(medicine => (
            <div
              key={medicine.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={medicine.image}
                alt={medicine.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{medicine.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{medicine.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-blue-600">
                    ₵{medicine.price.toFixed(2)}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      medicine.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {medicine.available ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};