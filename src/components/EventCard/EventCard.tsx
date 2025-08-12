import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';
import { Event } from '../../types';

interface EventCardProps {
  event: Event;
  onPress: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
}

export default function EventCard({
  event,
  onPress,
  onFavoritePress,
  isFavorite = false,
}: EventCardProps) {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      // Use Georgian calendar with proper locale formatting
      return date.toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      {event.imageUrl && (
        <Image source={{ uri: event.imageUrl }} style={styles.eventImage} />
      )}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {event.name}
          </Text>
          {onFavoritePress && (
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={onFavoritePress}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.favoriteIcon}>
                {isFavorite ? '❤️' : '🤍'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.date}>{formatDate(event.startDate)}</Text>
        <Text style={styles.venue} numberOfLines={1}>{event.venue.name}</Text>
        <Text style={styles.city}>{event.venue.city}</Text>
        
        {event.priceRange && (
          <Text style={styles.price}>
            {event.priceRange.currency} {event.priceRange.min} - {event.priceRange.max}
          </Text>
        )}
        
        <View style={styles.categoryContainer}>
          <Text style={styles.category}>{event.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    shadowColor: COLORS.text,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  content: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.md,
    lineHeight: 24,
  },
  favoriteButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.xl,
  },
  date: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    fontWeight: '600',
  },
  venue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  city: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  price: {
    fontSize: FONT_SIZES.md,
    color: COLORS.success,
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.surface,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 16,
    overflow: 'hidden',
    fontWeight: '600',
  },
});
