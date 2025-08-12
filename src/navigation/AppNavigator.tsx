import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useApp } from '../store/AppContext';
import { RootStackParamList, MainTabParamList } from './types';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/events/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EventDetailsScreen from '../screens/events/EventDetailsScreen';
import FavoritesScreen from '../screens/profile/FavoritesScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <TabIcon name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  // We'll use a simple text icon for now, can be replaced with vector icons later
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color, fontSize: size }}>
        {name === 'home' ? '🏠' : '👤'}
      </Text>
    </View>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useApp();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {!user ? (
          // Auth screens
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          // Main app screens
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="EventDetails" component={EventDetailsScreen} />
            <Stack.Screen name="Favorites" component={FavoritesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
