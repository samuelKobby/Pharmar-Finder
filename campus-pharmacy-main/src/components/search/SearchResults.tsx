import React, { useState } from 'react';
import { Pagination } from '../ui/Pagination';
import { PharmacyCard } from './PharmacyCard';
import { categories, pharmacies } from '../../data/sampleData';

interface SearchResultsProps {
  query: string;
}

export const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Find all medicines that match the search query
  const matchingMedicines = categories.flatMap(category =>
    category.medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(query.toLowerCase()) ||
      medicine.description.toLowerCase().includes(query.toLowerCase())
    )
  );

  // Find pharmacies that have matching medicines
  const pharmaciesWithMedicine = pharmacies.map(pharmacy => ({
    ...pharmacy,
    matchingMedicines: matchingMedicines.filter(medicine => 
      pharmacy.available
    )
  })).filter(pharmacy => pharmacy.matchingMedicines.length > 0);

  // Calculate pagination
  const totalPages = Math.ceil(pharmaciesWithMedicine.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = pharmaciesWithMedicine.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">
        Found {pharmaciesWithMedicine.length} pharmacies with matching medicines
      </h2>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentResults.map(pharmacy => (
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
          onPageChange={setCurrentPage}
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