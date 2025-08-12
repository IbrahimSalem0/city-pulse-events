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
    borderRadius: 12,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  eventImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  content: {
    padding: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  favoriteIcon: {
    fontSize: FONT_SIZES.lg,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  venue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  city: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  price: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.success,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
  },
  category: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.background,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
