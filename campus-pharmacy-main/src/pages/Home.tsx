import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { HowItWorks } from '../components/home/HowItWorks';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { FeaturedPharmacies } from '../components/home/FeaturedPharmacies';

export const Home: React.FC = () => {
  return (
    <div className="relative">
      <HeroSection />
      <HowItWorks />
      <FeaturedProducts />
      <FeaturedPharmacies />
    </div>
  );
};