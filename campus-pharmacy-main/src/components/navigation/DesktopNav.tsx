import React from 'react';
import { NavLink } from './NavLink';

export const DesktopNav: React.FC = () => (
  <div className="hidden md:flex items-center space-x-8">
    <NavLink to="/">Home</NavLink>
    <NavLink to="/medicines">Medicines</NavLink>
    <NavLink to="/pharmacies">Pharmacies</NavLink>
    <NavLink to="/about">About</NavLink>
    <NavLink to="/contact">Contact</NavLink>
  </div>
);