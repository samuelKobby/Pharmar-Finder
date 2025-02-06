import React from 'react';
import { Link } from 'react-router-dom';

export const Logo: React.FC = () => (
  <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-2">
    <span>Pharma</span>
    <span className="text-blue-200">Finder</span>
  </Link>
);