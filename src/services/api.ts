import { API_CONFIG } from '../constants';
import { Event, SearchParams, ApiResponse } from '../types';

export class ApiService {
  private static baseUrl = API_CONFIG.BASE_URL;
  private static apiKey = API_CONFIG.CONSUMER_KEY;

  private static async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    // Add API key to all requests
    url.searchParams.append('apikey', this.apiKey);
    
    // Add other parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    try {
      const response = await fetch(url.toString());
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw new Error(`API request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async searchEvents(params: SearchParams): Promise<ApiResponse<Event>> {
    const searchParams: Record<string, any> = {
      size: 20, // Number of results per page
    };

    if (params.keyword) {
      searchParams.keyword = params.keyword;
    }

    if (params.city) {
      searchParams.city = params.city;
    }

    if (params.category) {
      searchParams.classificationName = params.category;
    }

    try {
      const response = await this.makeRequest<{_embedded: {events: any[]}, page: any}>('/events.json', searchParams);
      
      // Transform Ticketmaster response to our Event format
      const events: Event[] = (response._embedded?.events || []).map((event: any) => ({
        id: event.id,
        name: event.name,
        description: event.info,
        startDate: event.dates?.start?.dateTime || event.dates?.start?.localDate,
        endDate: event.dates?.end?.dateTime || event.dates?.end?.localDate,
        venue: {
          name: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
          address: event._embedded?.venues?.[0]?.address?.line1 || '',
          city: event._embedded?.venues?.[0]?.city?.name || '',
          country: event._embedded?.venues?.[0]?.country?.countryCode || '',
          latitude: event._embedded?.venues?.[0]?.location?.latitude,
          longitude: event._embedded?.venues?.[0]?.location?.longitude,
        },
        imageUrl: event.images?.[0]?.url,
        priceRange: event.priceRanges?.[0] ? {
          min: event.priceRanges[0].min,
          max: event.priceRanges[0].max,
          currency: event.priceRanges[0].currency,
        } : undefined,
        category: event.classifications?.[0]?.segment?.name || 'Other',
      }));

      return {
        data: events,
        total: response.page?.totalElements || events.length,
        page: response.page?.number || 0,
        size: response.page?.size || 20,
      };
    } catch (error) {
      console.error('Error searching events:', error);
      throw error;
    }
  }

  static async getEventDetails(eventId: string): Promise<Event> {
    try {
      const response = await this.makeRequest<{_embedded: {events: any[]}}>(`/events/${eventId}.json`);
      
      if (!response._embedded?.events?.[0]) {
        throw new Error('Event not found');
      }

      const event = response._embedded.events[0];
      
      return {
        id: event.id,
        name: event.name,
        description: event.info,
        startDate: event.dates?.start?.dateTime || event.dates?.start?.localDate,
        endDate: event.dates?.end?.dateTime || event.dates?.end?.localDate,
        venue: {
          name: event._embedded?.venues?.[0]?.name || 'Unknown Venue',
          address: event._embedded?.venues?.[0]?.address?.line1 || '',
          city: event._embedded?.venues?.[0]?.city?.name || '',
          country: event._embedded?.venues?.[0]?.country?.countryCode || '',
          latitude: event._embedded?.venues?.[0]?.location?.latitude,
          longitude: event._embedded?.venues?.[0]?.location?.longitude,
        },
        imageUrl: event.images?.[0]?.url,
        priceRange: event.priceRanges?.[0] ? {
          min: event.priceRanges[0].min,
          max: event.priceRanges[0].max,
          currency: event.priceRanges[0].currency,
        } : undefined,
        category: event.classifications?.[0]?.segment?.name || 'Other',
      };
    } catch (error) {
      console.error('Error getting event details:', error);
      throw error;
    }
  }

  static async getCategories(): Promise<string[]> {
    try {
      const response = await this.makeRequest<{_embedded: {classifications: any[]}}>('/classifications.json');
      
      const categories = (response._embedded?.classifications || [])
        .map((classification: any) => classification.segment?.name)
        .filter(Boolean);

      return [...new Set(categories)]; // Remove duplicates
    } catch (error) {
      console.error('Error getting categories:', error);
      return ['Music', 'Sports', 'Arts & Theater', 'Family', 'Other']; // Fallback categories
    }
  }
}
