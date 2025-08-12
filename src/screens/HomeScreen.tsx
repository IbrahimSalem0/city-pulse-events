import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useEvents, useCategories } from '../hooks/useEvents';
import { useApp } from '../store/AppContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { SearchParams } from '../types';

export default function HomeScreen() {
  const [searchParams, setSearchParams] = useState<SearchParams>({});
  const [keyword, setKeyword] = useState('');
  const [city, setCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const { data: eventsData, isLoading, error } = useEvents(searchParams);
  const { data: categories } = useCategories();
  const { language, updateLanguage } = useApp();

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

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading events: {error.message}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {language === 'en' ? 'City Pulse Events' : 'أحداث نبض المدينة'}
        </Text>
        <TouchableOpacity style={styles.languageToggle} onPress={toggleLanguage}>
          <Text style={styles.languageText}>
            {language === 'en' ? 'العربية' : 'English'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <TextInput
          style={styles.input}
          placeholder={language === 'en' ? 'Search events...' : 'البحث عن الأحداث...'}
          value={keyword}
          onChangeText={setKeyword}
        />

        <TextInput
          style={styles.input}
          placeholder={language === 'en' ? 'City' : 'المدينة'}
          value={city}
          onChangeText={setCity}
        />

        {categories && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                !selectedCategory && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory('')}
            >
              <Text style={[
                styles.categoryChipText,
                !selectedCategory && styles.categoryChipTextActive,
              ]}>
                {language === 'en' ? 'All' : 'الكل'}
              </Text>
            </TouchableOpacity>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryChip,
                  selectedCategory === category && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text style={[
                  styles.categoryChipText,
                  selectedCategory === category && styles.categoryChipTextActive,
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>
            {language === 'en' ? 'Search' : 'بحث'}
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>
            {language === 'en' ? 'Searching events...' : 'البحث عن الأحداث...'}
          </Text>
        </View>
      )}

      {eventsData && eventsData.data.length > 0 && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>
            {language === 'en' ? 'Found Events' : 'الأحداث الموجودة'} ({eventsData.total})
          </Text>
          {eventsData.data.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>
                {formatDate(event.startDate)}
              </Text>
              <Text style={styles.eventVenue}>{event.venue.name}</Text>
              <Text style={styles.eventCity}>{event.venue.city}</Text>
              {event.priceRange && (
                <Text style={styles.eventPrice}>
                  {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
                </Text>
              )}
            </View>
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
  languageToggle: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  languageText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  searchSection: {
    padding: SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.surface,
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoryChip: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
  },
  categoryChipTextActive: {
    color: COLORS.background,
  },
  searchButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.md,
    alignItems: 'center',
  },
  searchButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
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
  eventCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  eventDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  eventVenue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  eventCity: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  eventPrice: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
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
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
