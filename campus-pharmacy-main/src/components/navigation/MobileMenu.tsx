import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="bg-blue-500 shadow-lg">
      <div className="px-2 pt-2 pb-3 space-y-1">
        <MobileNavLink to="/" onClick={onClose}>Home</MobileNavLink>
        <MobileNavLink to="/medicines" onClick={onClose}>Medicines</MobileNavLink>
        <MobileNavLink to="/pharmacies" onClick={onClose}>Pharmacies</MobileNavLink>
        <MobileNavLink to="/about" onClick={onClose}>About</MobileNavLink>
        <MobileNavLink to="/contact" onClick={onClose}>Contact</MobileNavLink>
      </div>
    </div>
  );
};

interface MobileNavLinkProps {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ to, onClick, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
        isActive
          ? 'bg-blue-600 text-white'
          : 'text-white hover:bg-blue-600'
      }`}
    >
      {children}
    </Link>
  );
};