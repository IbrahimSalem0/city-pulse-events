import { Platform, StatusBar } from 'react-native';

// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://app.ticketmaster.com/discovery/v2',
  CONSUMER_KEY: 'HWbd3YMOdikgJGw5G6qCEYzAQueRb0wM',
  CONSUMER_SECRET: 'MDKdXb4wZLQYJipl',
};

// Status Bar Heights
export const STATUS_BAR_HEIGHT = Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 0);
export const TOP_SPACING = STATUS_BAR_HEIGHT + 10; // Extra padding for content

// Colors
export const COLORS = {
  primary: '#007AFF',
  secondary: '#5856D6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  error: '#FF3B30', // Same as danger for consistency
  background: '#F2F2F7',
  surface: '#FFFFFF',
  text: '#000000',
  textSecondary: '#8E8E93',
  border: '#C6C6C8',
  placeholder: '#C7C7CC',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const STORAGE_KEYS = {
  USER_DATA: 'user_data',
  FAVORITE_EVENTS: 'favorite_events',
  LANGUAGE: 'language',
  AUTH_TOKEN: 'auth_token',
};

export const LANGUAGES = {
  en: 'English',
  ar: 'العربية',
} as const;

export const DEFAULT_CITY = 'Dubai';
export const DEFAULT_COUNTRY = 'AE';
