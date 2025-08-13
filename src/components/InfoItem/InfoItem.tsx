import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SPACING, FONT_SIZES } from '../../constants';

interface InfoItemProps {
  label: string;
  value: string | number;
  isDestructive?: boolean;
}

export default function InfoItem({ label, value, isDestructive = false }: InfoItemProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View style={[
      styles.infoItem,
      isDestructive && styles.infoItemDestructive,
    ]}>
      <Text style={[
        styles.infoLabel,
        isDestructive && styles.infoLabelDestructive,
        { textAlign: isRTL ? 'right' : 'left' }
      ]}>
        {label}
      </Text>
      <Text style={[
        styles.infoValue,
        isDestructive && styles.infoValueDestructive,
        { textAlign: isRTL ? 'right' : 'left' }
      ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoItemDestructive: {
    borderColor: COLORS.error,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  infoLabelDestructive: {
    color: COLORS.error,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  infoValueDestructive: {
    color: COLORS.error,
  },
});
