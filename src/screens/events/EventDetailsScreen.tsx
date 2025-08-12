import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEventDetails } from '../../hooks/useEvents';
import { useApp } from '../../store/AppContext';
import { Loading, SafeArea } from '../../components';
import { styles } from './EventDetailsScreen.styles';

export default function EventDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { eventId } = route.params as { eventId: string };
  const { data: event, isLoading, error } = useEventDetails(eventId);
  const { language, toggleFavorite, favoriteEvents } = useApp();

  if (isLoading) {
    return (
      <SafeArea>
        <Loading 
          message={language === 'en' ? 'Loading event details...' : 'جاري تحميل تفاصيل الحدث...'}
        />
      </SafeArea>
    );
  }

  if (error || !event) {
    return (
      <SafeArea>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {language === 'en' ? 'Error loading event details' : 'خطأ في تحميل تفاصيل الحدث'}
          </Text>
        </View>
      </SafeArea>
    );
  }

  const isFavorite = favoriteEvents.includes(eventId);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use Georgian calendar with proper locale formatting
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  const handleFavoriteToggle = () => {
    toggleFavorite(eventId);
    Alert.alert(
      isFavorite 
        ? (language === 'en' ? 'Removed from favorites' : 'تمت الإزالة من المفضلة')
        : (language === 'en' ? 'Added to favorites' : 'تمت الإضافة إلى المفضلة')
    );
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Text style={styles.backButtonText}>⬅️</Text>
          </TouchableOpacity>
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
            <Image 
              source={{ uri: event.imageUrl }} 
              style={styles.eventImage}
              resizeMode="cover"
            />
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
                  {Number(event.venue.latitude).toFixed(4)}, {Number(event.venue.longitude).toFixed(4)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeArea>
  );
}
