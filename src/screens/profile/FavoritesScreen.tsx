import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../../store/AppContext';
import { useEvents } from '../../hooks/useEvents';
import { EventCard, StatusBarSpacer } from '../../components';
import { COLORS } from '../../constants';
import { styles } from './FavoritesScreen.styles';
import { RootStackParamList } from '../../navigation/types';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favoriteEvents, language } = useApp();

  // Fetch all events to get details for favorites
  const { data: allEvents } = useEvents({});

  // Filter events to show only favorites
  const favoriteEventDetails = useMemo(() => {
    if (!allEvents?.data || !favoriteEvents.length) return [];
    
    return allEvents.data.filter(event => 
      favoriteEvents.includes(event.id)
    );
  }, [allEvents, favoriteEvents]);

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleEventPress = useCallback((eventId: string) => {
    navigation.navigate('EventDetails', { eventId });
  }, [navigation]);

  const handleFavoriteToggle = useCallback((eventId: string) => {
    // This will be handled by the EventCard component
  }, []);

  if (favoriteEvents.length === 0) {
    return (
      <View style={styles.container}>
        <StatusBarSpacer backgroundColor={COLORS.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {language === 'en' ? 'Favorites' : 'المفضلة'}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>
            {language === 'en' ? 'No Favorite Events' : 'لا توجد أحداث مفضلة'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {language === 'en' 
              ? 'Start exploring events and add them to your favorites!' 
              : 'ابدأ في استكشاف الأحداث وأضفها إلى المفضلة!'
            }
          </Text>
        </View>
      </View>
    );
  }

  const renderEventItem = useCallback(({ item }: { item: any }) => (
    <EventCard
      event={item}
      onPress={() => handleEventPress(item.id)}
      onFavoritePress={() => handleFavoriteToggle(item.id)}
      isFavorite={true} // Always true in favorites screen
    />
  ), [handleEventPress, handleFavoriteToggle]);

  return (
    <View style={styles.container}>
      <StatusBarSpacer backgroundColor={COLORS.background} />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {language === 'en' ? 'Favorites' : 'المفضلة'}
        </Text>
      </View>
      
      <FlatList
        data={favoriteEventDetails}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.headerInfo}>
            <Text style={styles.title}>
              {language === 'en' ? 'Favorite Events' : 'الأحداث المفضلة'}
            </Text>
            <Text style={styles.subtitle}>
              {favoriteEventDetails.length} {language === 'en' ? 'events' : 'أحداث'}
            </Text>
          </View>
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={5}
      />
    </View>
  );
}
