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
import { useEventsByIds } from '../../hooks/useEvents';
import { EventCard, StatusBarSpacer } from '../../components';
import { COLORS } from '../../constants';
import { styles } from './FavoritesScreen.styles';
import { RootStackParamList } from '../../navigation/types';
import { useTranslation } from 'react-i18next';

type FavoritesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EventDetails'>;

export default function FavoritesScreen() {
  const navigation = useNavigation<FavoritesScreenNavigationProp>();
  const { favoriteEvents, language } = useApp();
  const { t } = useTranslation();

  // Fetch favorite events by their IDs
  const favoriteEventsQueries = useEventsByIds(favoriteEvents);
  
  // Extract event data and loading/error states
  const favoriteEventDetails = useMemo(() => {
    const events = favoriteEventsQueries
      .map(query => query.data)
      .filter(Boolean) as any[];
    
    return events;
  }, [favoriteEventsQueries]);

  const isLoading = favoriteEventsQueries.some(query => query.isLoading);
  const hasError = favoriteEventsQueries.some(query => query.error);

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
            {t('Favorites')}
          </Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyTitle}>
            {t('NoFavoriteEvents')}
          </Text>
          <Text style={styles.emptySubtitle}>
            {t('StartExploring')}
          </Text>
        </View>
      </View>
    );
  }

  // Show loading state while fetching events
  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBarSpacer backgroundColor={COLORS.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('Favorites')}
          </Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {t('LoadingFavorites')}
          </Text>
        </View>
      </View>
    );
  }

  // Show error state if something went wrong
  if (hasError) {
    return (
      <View style={styles.container}>
        <StatusBarSpacer backgroundColor={COLORS.background} />
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {t('Favorites')}
          </Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.errorTitle}>
            {t('ErrorLoadingEvents')}
          </Text>
          <Text style={styles.errorSubtitle}>
            {t('PleaseTryAgainLater')}
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
          {t('Favorites')}
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
              {t('FavoriteEvents')}
            </Text>
            <Text style={styles.subtitle}>
              {favoriteEventDetails.length} {t('events')}
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
