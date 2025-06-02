import React, { useState, useEffect } from 'react';
import { Filter, MapPin } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import AccommodationFilters from '../components/accommodation/AccommodationFilters';
import AccommodationCard from '../components/accommodation/AccommodationCard';
import { Accommodation, Campus } from '../types';
import { fetchAccommodations } from '../lib/supabase';
import { motion } from 'framer-motion';
import {  Search, X, Heart, Tag, Star } from 'lucide-react';
import Button from '../components/ui/Button';


const AccommodationsPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedKos, setSelectedKos] = useState<Accommodation | null>(null);
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

  const handleKosClick = (kos: Accommodation) => {
    setSelectedKos(kos);
  };

  const closeKosDetail = () => {
    setSelectedKos(null);
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
                <div onClick={() => handleKosClick(accommodation)}>
                  <AccommodationCard
                  key={accommodation.id}
                  accommodation={accommodation}/>
                </div>
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
        {selectedKos && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto z-[999]"
              >
                <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
                  <h2 className="text-xl font-bold">{selectedKos.name}</h2>
                  <button
                    onClick={closeKosDetail}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="p-6">
                   <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                    <img
                      src={selectedKos.images[0]}
                      alt={selectedKos.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                        <span>{selectedKos.address}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                        {/* <Rating value={selectedKos.rating} /> */}
                        <span className="ml-2">{selectedKos.rating}/5</span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">
                        Rp {selectedKos.price}
                      </p>
                      <p className="text-gray-500">per {selectedKos.price}</p>
                    </div>
                  </div>
                  
                  {selectedKos.has_promotion && (
                    <div className="mb-6 p-3 bg-accent bg-opacity-10 rounded-md border border-accent border-opacity-20">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-accent mr-2" />
                        <p className="font-medium text-accent">{selectedKos.promotion_details}</p>
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Description</h3>
                    <p className="text-gray-700">{selectedKos.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Facilities</h3>
                      <ul className="space-y-2">
                        {selectedKos.facilities.map((facility, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
                            <span>{facility}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Rules</h3>
                      <ul className="space-y-2">
                        {selectedKos.rules.map((rule, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-error mr-2"></div>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <ul className="space-y-2">
                        {selectedKos.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-success mr-2"></div>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Location</h3>
                    <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                      <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                      <span className="text-gray-500">Map View (Placeholder)</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={closeKosDetail}>
                      Close
                    </Button>
                    <Button>
                      Contact Owner
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

      <AppFooter />
    </div>
  );
};

export default AccommodationsPage;