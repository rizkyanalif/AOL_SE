import React, { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import AccommodationFilters from '../components/accommodation/AccommodationFilters';
import AccommodationCard from '../components/accommodation/AccommodationCard';
import { Accommodation, Campus } from '../types';

const AccommodationsPage: React.FC = () => {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);

  useEffect(() => {
    const campusData = localStorage.getItem('selectedCampus');

    // Placeholder data
    const placeholderAccommodations: Accommodation[] = [
      {
        id: 1,
        name: "Kost Singgahsini",
        address: "Jl. Kebon Jeruk Raya No. 35, Jakarta Barat",
        distance: 0.5,
        campusId: 1,
        price: 3000000,
        gender: "male",
        hasAC: true,
        hasPrivateBathroom: true,
        hasFurnishedBed: true,
        hasWifi: true,
        hasParking: true,
        images: ['/images/kost3.jpg'],
        description: "Clean and comfortable kost...",
        rules: ["No smoking", "No pets"],
        facilities: ["AC", "Private Bathroom"],
        benefits: ["Close to campus"],
        rating: 4.5,
        reviewCount: 28,
        latitude: -6.201920,
        longitude: 106.783352,
        hasPromotion: true,
        promotionDetails: "10% off first month",
        availability: 3
      },
      {
        id: 2,
        name: "Kost Averio",
        address: "Jl. Palmerah Barat No. 12, Jakarta Barat",
        distance: 0.8,
        campusId: 1,
        price: 2500000,
        gender: "female",
        hasAC: true,
        hasPrivateBathroom: false,
        hasFurnishedBed: true,
        hasWifi: true,
        hasParking: false,
        images: ['/images/kost2.jpg'],
        description: "Female-only kost...",
        rules: ["Female only", "No smoking"],
        facilities: ["AC", "Shared Bathroom"],
        benefits: ["Close to campus"],
        rating: 4.2,
        reviewCount: 15,
        latitude: -6.202462,
        longitude: 106.786102,
        hasPromotion: false,
        availability: 2
      },
      {
        id: 3,
        name: "Kost Sejahtera",
        address: "Jl. Rawa Belong No. 45, Jakarta Barat",
        distance: 1.2,
        campusId: 2,
        price: 2100000,
        gender: "mixed",
        hasAC: true,
        hasPrivateBathroom: true,
        hasFurnishedBed: true,
        hasWifi: true,
        hasParking: true,
        images: [
          "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
          "https://images.pexels.com/photos/1648776/pexels-photo-1648776.jpeg"
        ],
        description: "Modern kost...",
        rules: ["No smoking inside rooms"],
        facilities: ["AC", "Private Bathroom"],
        benefits: ["Near restaurants"],
        rating: 4.7,
        reviewCount: 32,
        latitude: -6.199462,
        longitude: 106.783102,
        hasPromotion: true,
        promotionDetails: "Free first week",
        availability: 5
      },
      {
    id: 1,
    name: "Kost Melati",
    address: "Jl. Cisitu Lama No. 21, Bandung",
    distance: 0.4,
    campusId: 4,
    price: 1500000,
    gender: "female",
    hasAC: false,
    hasPrivateBathroom: false,
    hasFurnishedBed: true,
    hasWifi: true,
    hasParking: false,
    images: ["https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg"],
    description: "Kost putri dekat Binus dengan suasana asri.",
    rules: ["No smoking", "No pets"],
    facilities: ["Wifi", "Kasur", "Kipas Angin"],
    benefits: ["Dekat kampus", "Lingkungan tenang"],
    rating: 4.5,
    reviewCount: 23,
    latitude: -6.8902,
    longitude: 107.6108,
    hasPromotion: true,
    availability: 3
  },
      
  {
    id: 5,
    name: "Kost Cikokol",
    address: "Jl. Sutera Indah No. 10, Alam Sutera",
    distance: 0.5,
    campusId: 3,
    price: 2700000,
    gender: "female",
    hasAC: true,
    hasPrivateBathroom: true,
    hasFurnishedBed: true,
    hasWifi: true,
    hasParking: true,
    images: ["/images/kostalsut1.jpg"],
    description: "Kost eksklusif untuk putri, dekat mall dan kampus.",
    rules: ["No male guests", "No smoking"],
    facilities: ["AC", "Kamar Mandi Dalam", "Furnished", "Wifi"],
    benefits: ["Dekat kampus", "Dekat mall", "Akses 24 jam"],
    rating: 4.6,
    reviewCount: 25,
    latitude: -6.2245,
    longitude: 106.6537,
    hasPromotion: true,
    availability: 3
  },
  {
    id: 6,
    name: "Kost Kencana Bekasi",
    address: "Jl. Raya Galaxy No. 8, Bekasi Selatan",
    distance: 1.0,
    campusId: 5,
    price: 1800000,
    gender: "male",
    hasAC: false,
    hasPrivateBathroom: false,
    hasFurnishedBed: true,
    hasWifi: true,
    hasParking: true,
    images: ["/images/kostbekasi1.jpg"],
    description: "Kost putra murah dengan lingkungan nyaman.",
    rules: ["No pets"],
    facilities: ["Wifi", "Kasur", "Parkir"],
    benefits: ["Harga terjangkau", "Dekat kampus"],
    rating: 4.0,
    reviewCount: 12,
    latitude: -6.2624,
    longitude: 106.9902,
    hasPromotion: false,
    availability: 4
  },
  {
    id: 7,
    name: "Kost Hijau Kijang",
    address: "Jl. Nusantara No. 5, Kijang, Bintan",
    distance: 0.7,
    campusId: 6,
    price: 1000000,
    gender: "mixed",
    hasAC: false,
    hasPrivateBathroom: false,
    hasFurnishedBed: false,
    hasWifi: false,
    hasParking: true,
    images: ["https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg"],
    description: "Kost sederhana campur dengan suasana tenang.",
    rules: ["No smoking", "No loud music"],
    facilities: ["Parkir"],
    benefits: ["Lingkungan asri", "Harga sangat terjangkau"],
    rating: 3.5,
    reviewCount: 7,
    latitude: 0.9013,
    longitude: 104.5396,
    hasPromotion: true,
    availability: 5
  }
    ];

    if (campusData) {
      const campus: Campus = JSON.parse(campusData);
      setSelectedCampus(campus);

      // Filter kos berdasarkan campusId
      const filtered = placeholderAccommodations.filter(
        (acc) => acc.campusId === campus.id
      );

      setAccommodations(filtered);
      setFilteredAccommodations(filtered);
    } else {
      // fallback jika tidak ada kampus dipilih
      setAccommodations(placeholderAccommodations);
      setFilteredAccommodations(placeholderAccommodations);
    }

    setIsLoading(false);
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
        if (filters.facilities.includes('ac') && !acc.hasAC) return false;
        if (filters.facilities.includes('privateBathroom') && !acc.hasPrivateBathroom) return false;
        if (filters.facilities.includes('wifi') && !acc.hasWifi) return false;
        if (filters.facilities.includes('furnishedBed') && !acc.hasFurnishedBed) return false;
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