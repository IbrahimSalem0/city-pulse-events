import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';
import { SafeArea } from '../components';

export default function SplashScreen() {
  return (
    <SafeArea>
      <Text style={styles.title}>City Pulse</Text>
      <Text style={styles.subtitle}>Local Events Explorer</Text>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});
