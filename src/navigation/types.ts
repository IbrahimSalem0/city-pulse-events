import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Main: undefined;
  EventDetails: { eventId: string };
  Favorites: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  HomeScreen: undefined;
  SearchResults: { keyword?: string; city?: string; category?: string };
};

export type ProfileStackParamList = {
  ProfileScreen: undefined;
  Settings: undefined;
  Favorites: undefined;
};
