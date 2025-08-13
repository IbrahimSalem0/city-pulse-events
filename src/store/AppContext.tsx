import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { I18nManager, Alert } from 'react-native';
import * as Updates from 'expo-updates';
import { StorageService } from '../services/storage';
import { User, Event } from '../types';
import { changeLanguage, getCurrentLanguage } from '../locales';

interface AppState {
  user: User | null;
  favoriteEvents: string[];
  language: 'en' | 'ar';
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_FAVORITE_EVENTS'; payload: string[] }
  | { type: 'ADD_FAVORITE_EVENT'; payload: string }
  | { type: 'REMOVE_FAVORITE_EVENT'; payload: string }
  | { type: 'SET_LANGUAGE'; payload: 'en' | 'ar' }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: AppState = {
  user: null,
  favoriteEvents: [],
  language: 'en',
  isLoading: true,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_FAVORITE_EVENTS':
      return { ...state, favoriteEvents: action.payload };
    case 'ADD_FAVORITE_EVENT':
      return {
        ...state,
        favoriteEvents: [...state.favoriteEvents, action.payload],
      };
    case 'REMOVE_FAVORITE_EVENT':
      return {
        ...state,
        favoriteEvents: state.favoriteEvents.filter(id => id !== action.payload),
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppContextType extends AppState {
  dispatch: React.Dispatch<AppAction>;
  toggleFavorite: (eventId: string) => void;
  updateLanguage: (language: 'en' | 'ar') => void;
  updateUser: (user: User | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load initial data from storage
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [user, favorites, language] = await Promise.all([
          StorageService.getUser(),
          StorageService.getFavoriteEvents(),
          StorageService.getLanguage(),
        ]);

        if (user) dispatch({ type: 'SET_USER', payload: user });
        if (favorites) dispatch({ type: 'SET_FAVORITE_EVENTS', payload: favorites });
        if (language) {
          dispatch({ type: 'SET_LANGUAGE', payload: language });
          // Sync i18n language with stored language
          await changeLanguage(language);
          
          // Apply RTL setting from stored language
          const isRTL = language === 'ar';
          if (I18nManager.isRTL !== isRTL) {
            I18nManager.forceRTL(isRTL);
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadInitialData();
  }, []);

  // Save data to storage when it changes
  useEffect(() => {
    if (!state.isLoading) {
      StorageService.saveFavoriteEvents(state.favoriteEvents);
    }
  }, [state.favoriteEvents, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading && state.language) {
      StorageService.saveLanguage(state.language);
    }
  }, [state.language, state.isLoading]);

  useEffect(() => {
    if (!state.isLoading && state.user) {
      StorageService.saveUser(state.user);
    }
  }, [state.user, state.isLoading]);

  const toggleFavorite = (eventId: string) => {
    if (state.favoriteEvents.includes(eventId)) {
      dispatch({ type: 'REMOVE_FAVORITE_EVENT', payload: eventId });
    } else {
      dispatch({ type: 'ADD_FAVORITE_EVENT', payload: eventId });
    }
  };

  const updateLanguage = async (language: 'en' | 'ar') => {
    try {
      const isRTL = language === 'ar';
      const currentRTL = I18nManager.isRTL;
      
      // If RTL is already correct, just change language
      if (isRTL === currentRTL) {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
        await changeLanguage(language);
        return;
      }
      
      // RTL change needed - show alert first
      Alert.alert(
        'Change Language',
        'The app will reload to apply the language change.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: async () => {
              try {
                // Update state and language first
                dispatch({ type: 'SET_LANGUAGE', payload: language });
                await changeLanguage(language);
                
                // Force RTL change
                I18nManager.forceRTL(isRTL);
                
                // Try to reload app using expo-updates
                try {
                  await Updates.reloadAsync();
                } catch (reloadError) {
                  // Fallback for development mode: show manual restart message
                  Alert.alert(
                    'Manual Restart Required',
                    'Please close and reopen the app to apply the layout changes.',
                    [
                      {
                        text: 'OK',
                        onPress: () => {
                          // In development, we can't auto-reload, so just inform the user
                        },
                      },
                    ]
                  );
                }
              } catch (error) {
                console.error('Error during language change:', error);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  const updateUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const value: AppContextType = {
    ...state,
    dispatch,
    toggleFavorite,
    updateLanguage,
    updateUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
