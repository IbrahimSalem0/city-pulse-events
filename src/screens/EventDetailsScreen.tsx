import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useEventDetails } from '../hooks/useEvents';
import { useApp } from '../store/AppContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

export default function EventDetailsScreen({ route }: any) {
  const { eventId } = route.params;
  const { data: event, isLoading, error } = useEventDetails(eventId);
  const { favoriteEvents, toggleFavorite, language } = useApp();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>
          {language === 'en' ? 'Loading event details...' : 'جاري تحميل تفاصيل الحدث...'}
        </Text>
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {language === 'en' ? 'Error loading event details' : 'خطأ في تحميل تفاصيل الحدث'}
        </Text>
      </View>
    );
  }

  const isFavorite = favoriteEvents.includes(event.id);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    } catch {
      return dateString;
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(event.id);
    Alert.alert(
      isFavorite 
        ? (language === 'en' ? 'Removed from favorites' : 'تمت الإزالة من المفضلة')
        : (language === 'en' ? 'Added to favorites' : 'تمت الإضافة إلى المفضلة')
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{event.name}</Text>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite && styles.favoriteButtonActive]}
          onPress={handleFavoriteToggle}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>

      {event.imageUrl && (
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>
            {language === 'en' ? 'Event Image' : 'صورة الحدث'}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Event Details' : 'تفاصيل الحدث'}
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'Date & Time' : 'التاريخ والوقت'}
            </Text>
            <Text style={styles.detailValue}>
              {formatDate(event.startDate)}
            </Text>
          </View>

          {event.endDate && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {language === 'en' ? 'End Date' : 'تاريخ الانتهاء'}
              </Text>
              <Text style={styles.detailValue}>
                {formatDate(event.endDate)}
              </Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'Category' : 'الفئة'}
            </Text>
            <Text style={styles.detailValue}>{event.category}</Text>
          </View>

          {event.priceRange && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>
                {language === 'en' ? 'Price Range' : 'نطاق السعر'}
              </Text>
              <Text style={styles.detailValue}>
                {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Venue Information' : 'معلومات المكان'}
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'Venue' : 'المكان'}
            </Text>
            <Text style={styles.detailValue}>{event.venue.name}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'Address' : 'العنوان'}
            </Text>
            <Text style={styles.detailValue}>{event.venue.address}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'City' : 'المدينة'}
            </Text>
            <Text style={styles.detailValue}>{event.venue.city}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>
              {language === 'en' ? 'Country' : 'البلد'}
            </Text>
            <Text style={styles.detailValue}>{event.venue.country}</Text>
          </View>
        </View>

        {event.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Description' : 'الوصف'}
            </Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        {event.venue.latitude && event.venue.longitude && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Location' : 'الموقع'}
            </Text>
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>
                {language === 'en' ? 'Map Preview' : 'معاينة الخريطة'}
              </Text>
              <Text style={styles.mapPlaceholderText}>
                {language === 'en' ? 'Coordinates: ' : 'الإحداثيات: '}
                {event.venue.latitude.toFixed(4)}, {event.venue.longitude.toFixed(4)}
              </Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: SPACING.xl,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    flex: 1,
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: SPACING.md,
  },
  favoriteButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favoriteButtonActive: {
    backgroundColor: COLORS.error,
    borderColor: COLORS.error,
  },
  favoriteButtonText: {
    fontSize: FONT_SIZES.lg,
  },
  imageContainer: {
    height: 200,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    margin: SPACING.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imagePlaceholder: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    flex: 2,
    textAlign: 'right',
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapPlaceholderText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
});
