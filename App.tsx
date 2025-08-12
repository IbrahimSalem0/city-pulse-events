import 'react-native-gesture-handler';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/store/AppContext';
import AppNavigator from './src/navigation/AppNavigator';
import './src/locales/i18n'; // Initialize i18n

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AppNavigator />
        </AppProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
