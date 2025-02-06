import React, { useState } from 'react';
import { Pagination } from '../ui/Pagination';
import { PharmacyCard } from './PharmacyCard';
import { medicines, pharmacies } from '../../data/sampleData';
import { Medication, Pharmacy } from '../../types';

interface SearchResultsProps {
  query: string;
}

interface PharmacyWithMedicines extends Pharmacy {
  matchingMedicines: Medication[];
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Find all medicines that match the search query
  const matchingMedicines = medicines.filter(
    (medicine: Medication) =>
      medicine.name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.description.toLowerCase().includes(query.toLowerCase())
  );

  // Find pharmacies that have matching medicines
  const pharmaciesWithMedicine = pharmacies.map((pharmacy: Pharmacy) => ({
    ...pharmacy,
    matchingMedicines: matchingMedicines.filter((medicine: Medication) =>
      medicine.pharmacies.includes(pharmacy.id)
    ),
  })).filter((pharmacy) => pharmacy.matchingMedicines.length > 0);

  // Calculate pagination
  const totalPages = Math.ceil(pharmaciesWithMedicine.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPharmacies = pharmaciesWithMedicine.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Found {pharmaciesWithMedicine.length} pharmacies with matching medicines
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPharmacies.map((pharmacy) => (
          <PharmacyCard
            key={pharmacy.id}
            pharmacy={pharmacy}
            medicines={pharmacy.matchingMedicines}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {pharmaciesWithMedicine.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No pharmacies found with matching medicines.</p>
        </div>
      )}
    </div>
  );
};