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
      const events: Event[] = (response._embedded?.events || []).map((event: any) => {
        // Extract venue data properly based on Ticketmaster API structure
        const venue = event._embedded?.venues?.[0] || event.venue || {};
        
        return {
          id: event.id,
          name: event.name,
          description: event.info || event.description || event.pleaseNote || '',
          startDate: event.dates?.start?.dateTime || event.dates?.start?.localDate,
          endDate: event.dates?.end?.dateTime || event.dates?.end?.localDate,
          venue: {
            name: venue.name || 'Unknown Venue',
            address: venue.address?.line1 || venue.address?.line1 || '',
            city: venue.city?.name || venue.city || '',
            country: venue.country?.countryCode || venue.country || '',
            latitude: venue.location?.latitude || venue.latitude,
            longitude: venue.location?.longitude || venue.longitude,
          },
          imageUrl: event.images?.[0]?.url,
          priceRange: event.priceRanges?.[0] ? {
            min: event.priceRanges[0].min,
            max: event.priceRanges[0].max,
            currency: event.priceRanges[0].currency,
          } : undefined,
          category: event.classifications?.[0]?.segment?.name || 'Other',
        };
      });

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
      const response = await this.makeRequest<any>(`/events/${eventId}.json`);
      
      console.log('Ticketmaster API Response:', JSON.stringify(response, null, 2));
      
      // Handle different response structures from Ticketmaster
      let event;
      if (response._embedded?.events?.[0]) {
        event = response._embedded.events[0];
      } else if (response.id) {
        // Direct event response
        event = response;
      } else {
        throw new Error('Event not found');
      }
      
      console.log('Extracted Event:', JSON.stringify(event, null, 2));
      
      // Extract venue data properly based on Ticketmaster API structure
      const venue = event._embedded?.venues?.[0] || event.venue || {};
      
      console.log('Extracted Venue:', JSON.stringify(venue, null, 2));
      
      return {
        id: event.id,
        name: event.name,
        description: event.info || event.description || event.pleaseNote || '',
        startDate: event.dates?.start?.dateTime || event.dates?.start?.localDate || event.dates?.start?.dateTime,
        endDate: event.dates?.end?.dateTime || event.dates?.end?.localDate || event.dates?.end?.dateTime,
        venue: {
          name: venue.name || 'Unknown Venue',
          address: venue.address?.line1 || venue.address?.line1 || '',
          city: venue.city?.name || venue.city || '',
          country: venue.country?.countryCode || venue.country || '',
          latitude: venue.location?.latitude || venue.latitude,
          longitude: venue.location?.longitude || venue.longitude,
        },
        imageUrl: event.images?.[0]?.url || event.imageUrl,
        priceRange: event.priceRanges?.[0] ? {
          min: event.priceRanges[0].min,
          max: event.priceRanges[0].max,
          currency: event.priceRanges[0].currency,
        } : undefined,
        category: event.classifications?.[0]?.segment?.name || event.segment?.name || 'Other',
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
