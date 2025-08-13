import { useQuery, useMutation, useQueryClient, useQueries } from '@tanstack/react-query';
import { ApiService } from '../services/api';
import { SearchParams, Event } from '../types';

export function useEvents(searchParams: SearchParams) {
  return useQuery({
    queryKey: ['events', searchParams],
    queryFn: () => ApiService.searchEvents(searchParams),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    enabled: !!(searchParams.keyword || searchParams.city),
  });
}

export function useEventDetails(eventId: string) {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => ApiService.getEventDetails(eventId),
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    enabled: !!eventId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => ApiService.getCategories(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

export function useEventsByIds(eventIds: string[]) {
  return useQueries({
    queries: eventIds.map(id => ({
      queryKey: ['event', id],
      queryFn: () => ApiService.getEventDetails(id),
      staleTime: 10 * 60 * 1000, // 10 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes
      enabled: !!id,
    })),
  });
}

export function useAllEvents() {
  return useQuery({
    queryKey: ['allEvents'],
    queryFn: () => ApiService.searchEvents({ keyword: 'music', city: 'Dubai' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useEventSearch() {
  const queryClient = useQueryClient();

  const searchEvents = useMutation({
    mutationFn: (params: SearchParams) => ApiService.searchEvents(params),
    onSuccess: (data, variables) => {
      // Update the cache with new search results
      queryClient.setQueryData(['events', variables], data);
    },
  });

  return {
    searchEvents: searchEvents.mutate,
    isSearching: searchEvents.isPending,
    searchError: searchEvents.error,
  };
}
