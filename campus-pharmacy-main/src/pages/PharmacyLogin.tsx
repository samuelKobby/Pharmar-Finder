import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const PharmacyLogin: React.FC = () => {
  const [pharmacyId, setPharmacyId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple mock authentication
    if (pharmacyId === 'PHARM001' && password === 'password123') {
      // Store pharmacy login state
      localStorage.setItem('pharmacyLoggedIn', 'true');
      localStorage.setItem('pharmacyId', pharmacyId);
      navigate('/pharmacy-dashboard');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-500 text-white py-4 px-6">
          <h2 className="text-xl font-semibold">Pharmacy Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="pharmacyId" className="block text-gray-700 mb-2">Pharmacy ID</label>
            <input
              type="text"
              id="pharmacyId"
              value={pharmacyId}
              onChange={(e) => setPharmacyId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-700 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
