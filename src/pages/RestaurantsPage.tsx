import React, { useState, useEffect } from 'react';
import { MapPin, Search, Filter } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import RestaurantCard from '../components/restaurant/RestaurantCard';
import Button from '../components/ui/Button';
import { Restaurant, Campus, MenuItem } from '../types';
import { fetchRestaurants } from '../lib/supabase';
import { X, Heart, Tag, Star, Menu } from 'lucide-react';
import Rating from '../components/ui/Rating';
import { motion } from 'framer-motion';



const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activePriceFilter, setActivePriceFilter] = useState<string | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
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
          restaurant.name.toLowerCase().includes(query) //|| 
          // restaurant.cuisine.toLowerCase().includes(query)  ||
          // restaurant.menu_items.some(item => item.name.toLowerCase().includes(query))
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
  
  const handleRestaurantClick = (place: Restaurant) => {
    setSelectedRestaurant(place);
  };

  const closeRestaurantDetail = () => {
    setSelectedRestaurant(null);
  };

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
            <h2 className="text-xl font-semibold text-neutral-800 mb-4">Restaurant</h2>
            
            <div className="flex flex-col md:flex-row items-start gap-4 mb-4">
              {/* Search */}
              <div className="relative w-full md:w-auto md:flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search restaurants"
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
                <div onClick={() => handleRestaurantClick(restaurant)}>
                  <RestaurantCard 
                    key={restaurant.id} 
                    restaurant={restaurant} 
                  />
                </div>
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
      {selectedRestaurant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto"
            >
              <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10">
                <h2 className="text-xl font-bold">{selectedRestaurant.name}</h2>
                <button
                  onClick={closeRestaurantDetail}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="relative h-64 mb-6 rounded-lg overflow-hidden">
                  <img
                    src={selectedRestaurant.images}
                    alt={selectedRestaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <span>{selectedRestaurant.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-2" />
                      <Rating value={selectedRestaurant.rating} />
                      <span className="ml-2">{selectedRestaurant.rating}/5</span>
                    </div>
                  </div>
                </div>
                
                {selectedRestaurant.has_promotion && selectedRestaurant.promotion_details && (
                  <div className="mb-6 p-3 bg-accent bg-opacity-10 rounded-md border border-accent border-opacity-20">
                    <div className="flex items-center">
                      <Tag className="h-5 w-5 text-accent mr-2" />
                      <p className="font-medium text-accent">{selectedRestaurant.promotion_details}</p>
                    </div>
                  </div>
                )}
                
                {/* <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-gray-700">{selectedRestaurant.description}</p>
                </div> */}
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Menu</h3>
                  
                      <h4 className="font-medium text-gray-800 mb-3 pb-1 border-b">{}</h4>
                      <div className="space-y-4">
                        {selectedRestaurant.menu.map(item => (
                          <div key={selectedRestaurant.id} className="flex justify-between">
                            <div>
                              <h5 className="font-medium">{item}</h5>
                            </div>
                          </div>
                        ))}
                      </div>
                    

                  {/* {Object.entries(groupedMenu(selectedRestaurant.menu)).map(([category, items]) => (
                    <div key={category} className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3 pb-1 border-b">{category}</h4>
                      <div className="space-y-4">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between">
                            <div>
                              <h5 className="font-medium">{item.name}</h5>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                            <p className="font-medium">Rp {formatPrice(item.price)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))} */}
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Location</h3>
                  <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                    <MapPin className="h-8 w-8 text-gray-400 mr-2" />
                    <span className="text-gray-500">Map View (Placeholder)</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={closeRestaurantDetail}>
                    Close
                  </Button>
                  <Button>
                    Get Directions
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      {/* <AppFooter /> */}
    </div>
  );
};

export default RestaurantsPage;