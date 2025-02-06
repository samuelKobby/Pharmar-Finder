import React from 'react';
import { Link } from 'react-router-dom';

export const HeroSection: React.FC = () => (
  <div className="relative h-screen">
    <div className="absolute inset-0">
      <img
        src="https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&q=80"
        alt="Pharmacy background"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    </div>
    
    <div className="relative h-full flex items-center">
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl font-bold mb-6">Pharma Finder</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Find medicines and campus pharmacies near you with real-time availability information.
        </p>
        <Link 
          to="/medicines" 
          className="inline-block bg-blue-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors"
        >
          Find Medicines
        </Link>
      </div>
    </div>
  </div>
);