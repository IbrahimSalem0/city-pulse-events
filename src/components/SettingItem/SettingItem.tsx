import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { COLORS, SPACING, FONT_SIZES } from "../../constants";

interface SettingItemProps {
  label: string;
  value?: string;
  onPress: () => void;
  showArrow?: boolean;
  isDestructive?: boolean;
  disabled?: boolean;
}

export default function SettingItem({
  label,
  value,
  onPress,
  showArrow = true,
  isDestructive = false,
  disabled = false,
}: SettingItemProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <TouchableOpacity
      style={[
        styles.settingItem,
        isDestructive && styles.settingItemDestructive,
        disabled && styles.settingItemDisabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingLabel,
            isDestructive && styles.settingLabelDestructive,
          ]}
        >
          {label}
        </Text>
        {value && (
          <Text
            style={[
              styles.settingValue,
              isDestructive && styles.settingValueDestructive,
            ]}
          >
            {value}
          </Text>
        )}
      </View>
      {showArrow && (
        <Text
          style={[
            styles.settingArrow,
            isDestructive && styles.settingArrowDestructive,
          ]}
        >
          ›
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingItemDestructive: {
    borderColor: COLORS.error,
  },
  settingItemDisabled: {
    opacity: 0.5,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    textAlign: "left",
  },
  settingLabelDestructive: {
    color: COLORS.error,
  },
  settingValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: "left",
  },
  settingValueDestructive: {
    color: COLORS.error,
  },
  settingArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  settingArrowDestructive: {
    color: COLORS.error,
  },
});
