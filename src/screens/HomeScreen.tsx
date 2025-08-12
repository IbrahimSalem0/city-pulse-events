import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useEvents, useCategories } from '../hooks/useEvents';
import { useApp } from '../store/AppContext';
import { COLORS, SPACING, FONT_SIZES, DEFAULT_CITY } from '../constants';
import { SearchParams } from '../types';
import { Loading, Error, Button, Input, EventCard, SafeArea } from '../components';

export default function HomeScreen() {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState(DEFAULT_CITY);
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: eventsData, isLoading, error } = useEvents(searchParams);
  const { data: categories } = useCategories();
  const { language, updateLanguage, toggleFavorite, favoriteEvents } = useApp();

  const handleSearch = () => {
    if (!keyword && !city) {
      Alert.alert('Error', 'Please enter a keyword or city to search');
      return;
    }

    setSearchParams({
      keyword: keyword.trim() || undefined,
      city: city.trim() || undefined,
      category: selectedCategory || undefined,
    });
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    updateLanguage(newLanguage);
  };

  const handleEventPress = (eventId: string) => {
    // Navigate to event details
    Alert.alert('Info', 'Navigation to event details would be implemented here');
  };

  if (error) {
    return (
      <SafeArea>
        <Error 
          message={`Error loading events: ${error.message}`}
          onRetry={() => setSearchParams({})}
        />
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'en' ? 'City Pulse Events' : 'أحداث نبض المدينة'}
          </Text>
          <Button
            title={language === 'en' ? 'العربية' : 'English'}
            onPress={toggleLanguage}
            variant="primary"
            size="small"
          />
        </View>

        <View style={styles.searchSection}>
          <Input
            placeholder={language === 'en' ? 'Search events...' : 'البحث عن الأحداث...'}
            value={keyword}
            onChangeText={setKeyword}
          />

          <Input
            placeholder={language === 'en' ? 'City' : 'المدينة'}
            value={city}
            onChangeText={setCity}
          />

          {categories && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
              <Button
                title={language === 'en' ? 'All' : 'الكل'}
                onPress={() => setSelectedCategory('')}
                variant={!selectedCategory ? 'primary' : 'outline'}
                size="small"
                style={styles.categoryButton}
              />
              {categories.map((category) => (
                <Button
                  key={category}
                  title={category}
                  onPress={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'primary' : 'outline'}
                  size="small"
                  style={styles.categoryButton}
                />
              ))}
            </ScrollView>
          )}

          <Button
            title={language === 'en' ? 'Search' : 'بحث'}
            onPress={handleSearch}
            style={styles.searchButton}
          />
        </View>

        {isLoading && (
          <Loading 
            message={language === 'en' ? 'Searching events...' : 'البحث عن الأحداث...'}
          />
        )}

        {eventsData && eventsData.data.length > 0 && (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>
              {language === 'en' ? 'Found Events' : 'الأحداث الموجودة'} ({eventsData.total})
            </Text>
            {eventsData.data.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onPress={() => handleEventPress(event.id)}
                onFavoritePress={() => toggleFavorite(event.id)}
                isFavorite={favoriteEvents.includes(event.id)}
              />
            ))}
          </View>
        )}

        {eventsData && eventsData.data.length === 0 && searchParams.keyword && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              {language === 'en' ? 'No events found. Try different search terms.' : 'لم يتم العثور على أحداث. جرب مصطلحات بحث مختلفة.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  searchSection: {
    padding: SPACING.lg,
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoryButton: {
    marginRight: SPACING.sm,
  },
  searchButton: {
    marginTop: SPACING.sm,
  },
  resultsSection: {
    padding: SPACING.lg,
  },
  resultsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  noResults: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  noResultsText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
});
