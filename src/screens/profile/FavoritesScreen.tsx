import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useApp } from '../../store/AppContext';
import { EventCard, SafeArea, Loading } from '../../components';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

export default function FavoritesScreen() {
  const { favoriteEvents, language } = useApp();

  if (favoriteEvents.length === 0) {
    return (
      <SafeArea>
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
      </SafeArea>
    );
  }

  return (
    <SafeArea>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {language === 'en' ? 'Favorite Events' : 'الأحداث المفضلة'}
          </Text>
          <Text style={styles.subtitle}>
            {favoriteEvents.length} {language === 'en' ? 'events' : 'أحداث'}
          </Text>
        </View>
        
        <View style={styles.eventsList}>
          {/* Note: In a real app, you'd fetch the full event details for each favorite ID */}
          {favoriteEvents.map((eventId, index) => (
            <View key={eventId} style={styles.eventPlaceholder}>
              <Text style={styles.eventPlaceholderText}>
                {language === 'en' ? 'Event ID:' : 'معرف الحدث:'} {eventId}
              </Text>
              <Text style={styles.eventPlaceholderText}>
                {language === 'en' ? 'Event details would be loaded here' : 'سيتم تحميل تفاصيل الحدث هنا'}
              </Text>
            </View>
          ))}
        </View>
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
    padding: SPACING.lg,
    backgroundColor: COLORS.surface,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  eventsList: {
    padding: SPACING.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  eventPlaceholder: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  eventPlaceholderText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
});
