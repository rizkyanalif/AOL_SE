import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/ui/Button';
import { Restaurant, Campus, MenuItem } from '../types';
import { fetchRestaurants } from '../lib/supabase';

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activePriceFilter, setActivePriceFilter] = useState<string | null>(null);
  const [activeCuisineFilter, setActiveCuisineFilter] = useState<string | null>(null);
  
  useEffect(() => {
    const loadRestaurant = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const campusData = localStorage.getItem('selectedCampus');
        let campus: Campus | null = null;
        if (campusData) {
          campus = JSON.parse(campusData);
          setSelectedCampus(campus);
        }
        const { data, error } = await fetchRestaurants({campusId: campus?.id});
        if (error) {
          throw new Error('Failed to load accommodations');
        } else if (data) {
          setRestaurants(data);
          setFilteredRestaurants(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
          
    };

    loadRestaurant();
  }, []);

  
  useEffect(() => {
    if (restaurants.length > 0) {
      applyFilters();
    }
  }, [searchQuery, activePriceFilter, activeCuisineFilter, restaurants]);
  
  const applyFilters = () => {
    let filtered = [...restaurants];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        restaurant => 
          restaurant.name.toLowerCase().includes(query) || 
          restaurant.cuisine.toLowerCase().includes(query) ||
          restaurant.menu_items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    // Apply price filter
    if (activePriceFilter) {
      filtered = filtered.filter(restaurant => restaurant.price_range === activePriceFilter);
    }
    
    // Apply cuisine filter
    if (activeCuisineFilter) {
      filtered = filtered.filter(restaurant => restaurant.cuisine === activeCuisineFilter);
    }
    
    setFilteredRestaurants(filtered);
  };
  
  const handlePriceFilter = (price: string) => {
    setActivePriceFilter(activePriceFilter === price ? null : price);
  };
  
  const handleCuisineFilter = (cuisine: string) => {
    setActiveCuisineFilter(activeCuisineFilter === cuisine ? null : cuisine);
  };
  
  const cuisines = [...new Set(restaurants.map(restaurant => restaurant.cuisine))];
  
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      
      <main className="flex-grow bg-gradient-to-b from-primary-50 to-primary-100 px-4 py-6">
        <div className="container mx-auto">
          {/* Campus Location */}
          {selectedCampus && (
            <div className="flex items-center mb-6">
              <MapPin className="h-5 w-5 text-primary-600 mr-2" />
              <p className="text-neutral-700">
                Showing restaurants near <span className="font-medium">{selectedCampus.name}</span>
              </p>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Restaurants</h2>
            
            <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
              {/* Search */}
              <div className="relative w-full md:w-auto md:flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants or dishes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
              
              {/* Filter buttons */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={activePriceFilter === 'low' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePriceFilter('low')}
                  >
                    $
                  </Button>
                  <Button
                    variant={activePriceFilter === 'medium' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePriceFilter('medium')}
                  >
                    $$
                  </Button>
                  <Button
                    variant={activePriceFilter === 'high' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePriceFilter('high')}
                  >
                    $$$
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-2">
                  {cuisines.map(cuisine => (
                    <Button
                      key={cuisine}
                      variant={activeCuisineFilter === cuisine ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => handleCuisineFilter(cuisine)}
                    >
                      {cuisine}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Restaurant List */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map(restaurant => (
                <RestaurantCard 
                  key={restaurant.id} 
                  restaurant={restaurant} 
                />
              ))}
              
              {filteredRestaurants.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-neutral-600 text-lg">No restaurants match your search or filters. Try adjusting your criteria.</p>
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

export default RestaurantsPage;