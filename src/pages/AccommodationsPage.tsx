import React, { useState, useEffect } from 'react';
import { Filter, MapPin } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import AccommodationFilters from '../components/accommodation/AccommodationFilters';
import AccommodationCard from '../components/accommodation/AccommodationCard';
import { Accommodation, Campus } from '../types';
import { fetchAccommodations } from '../lib/supabase';

const AccommodationsPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);


  useEffect(() => {
    const loadAccommodations = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const campusData = localStorage.getItem('selectedCampus');
        let campus: Campus | null = null;
        if (campusData) {
          campus = JSON.parse(campusData);
          setSelectedCampus(campus);
        }
        const { data, error } = await fetchAccommodations({campusId: campus?.id});

        if (error) {
          throw new Error('Failed to load accommodations');
        } else if (data) {
          setAccommodations(data);
          setFilteredAccommodations(data)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAccommodations();
  }, []);

  const handleApplyFilters = (filters: any) => {
    let filtered = [...accommodations];

    if (filters.minPrice !== undefined) {
      filtered = filtered.filter(acc => acc.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      filtered = filtered.filter(acc => acc.price <= filters.maxPrice);
    }

    if (filters.gender) {
      filtered = filtered.filter(acc => acc.gender === filters.gender);
    }

    if (filters.facilities && filters.facilities.length > 0) {
      filtered = filtered.filter(acc => {
        if (filters.facilities.includes('ac') && !acc.has_ac) return false;
        if (filters.facilities.includes('privateBathroom') && !acc.has_private_bathroom) return false;
        if (filters.facilities.includes('wifi') && !acc.has_wifi) return false;
        if (filters.facilities.includes('furnishedBed') && !acc.has_furnished_bed) return false;
        return true;
      });
    }

    setFilteredAccommodations(filtered);
  };

  const handleResetFilters = () => {
    setFilteredAccommodations(accommodations);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-grow bg-gradient-to-b from-primary-50 to-primary-100 px-4 py-6">
        <div className="container mx-auto">
          {/* Campus Info */}
          {selectedCampus && (
            <div className="flex items-center mb-6">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              <p className="text-neutral-700">
                Showing accommodations near <span className="font-medium">{selectedCampus.name}</span>
              </p>
            </div>
          )}

          {/* Filters */}
          <AccommodationFilters
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />

          {/* Results */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAccommodations.map(accommodation => (
                <AccommodationCard key={accommodation.id} accommodation={accommodation} />
              ))}
              {filteredAccommodations.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-neutral-600 text-lg">No accommodations match your filters. Try adjusting your criteria.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
};

export default AccommodationsPage;