export interface Event {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    latitude?: number;
    longitude?: number;
  };
  imageUrl?: string;
  priceRange?: {
    min: number;
    max: number;
    currency: string;
  };
  category: string;
  isFavorite?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  favoriteEvents: string[];
  language: 'en' | 'ar';
}

export interface SearchParams {
  keyword?: string;
  city?: string;
  category?: string;
}

export interface ApiResponse<T> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export interface NavigationProps {
  navigation: any;
  route: any;
}
