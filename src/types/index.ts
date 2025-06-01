export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
}

export interface Campus {
  id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  image: string;
}

export interface Accommodation {
  id: number;
  name: string;
  address: string;
  distance: number;
  campus_id: number;
  price: number;
  gender: 'male' | 'female' | 'mixed';
  has_ac: boolean;
  has_private_bathroom: boolean;
  has_furnished_bed: boolean;
  has_wifi: boolean;
  has_parking: boolean;
  images: string[];
  description: string;
  rules: string[];
  facilities: string[];
  benefits: string[];
  rating: number;
  review_count: number;
  latitude: number;
  longitude: number;
  has_promotion: boolean;
  promotion_details?: string;
  availability: number;
}

export interface Restaurant {
  id: number;
  name: string;
  address: string;
  distance: number;
  campus_id: number;
  cuisine: string;
  price_range: 'low' | 'medium' | 'high';
  images: string[];
  menu_items: MenuItem[];
  opening_hours: string;
  rating: number;
  review_count: number;
  latitude: number;
  longitude: number;
  has_promotion: boolean;
  promotion_details?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  isPopular: boolean;
}

export interface Clinic {
  id: number;
  name: string;
  address: string;
  distance: number;
  campus_id: number;
  image: string;
  doctors: Doctor[];
  services: string[];
  opening_hours: string;
  has_emergency_service: boolean;
  rating: number;
  review_count: number;
  latitude: number;
  longitude: number;
}

export interface Doctor {
  id: number;
  name: string;
  specialization: string;
  image?: string;
  schedule: Schedule[];
  rating: number;
}

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface Review {
  id: number;
  userId: string;
  entityId: number;
  entityType: 'accommodation' | 'restaurant' | 'clinic';
  rating: number;
  comment: string;
  date: string;
  userName: string;
  userImage?: string;
}

export interface Filter {
  [key: string]: any;
}