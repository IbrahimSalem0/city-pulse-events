import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useApp } from '../store/AppContext';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

export default function ProfileScreen() {
  const { user, language, updateLanguage, updateUser } = useApp();

  const handleLogout = () => {
    Alert.alert(
      language === 'en' ? 'Logout' : 'تسجيل الخروج',
      language === 'en' ? 'Are you sure you want to logout?' : 'هل أنت متأكد من تسجيل الخروج؟',
      [
        {
          text: language === 'en' ? 'Cancel' : 'إلغاء',
          style: 'cancel',
        },
        {
          text: language === 'en' ? 'Logout' : 'تسجيل الخروج',
          style: 'destructive',
          onPress: () => updateUser(null),
        },
      ]
    );
  };

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    updateLanguage(newLanguage);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {language === 'en' ? 'User not found' : 'المستخدم غير موجود'}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Account Settings' : 'إعدادات الحساب'}
        </Text>

        <TouchableOpacity style={styles.settingItem} onPress={toggleLanguage}>
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>
              {language === 'en' ? 'Language' : 'اللغة'}
            </Text>
            <Text style={styles.settingValue}>
              {language === 'en' ? 'English' : 'العربية'}
            </Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Info', 'Profile editing would be implemented here')}
        >
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>
              {language === 'en' ? 'Edit Profile' : 'تعديل الملف الشخصي'}
            </Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => Alert.alert('Info', 'Notifications settings would be implemented here')}
        >
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>
              {language === 'en' ? 'Notifications' : 'الإشعارات'}
            </Text>
          </View>
          <Text style={styles.settingArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'Favorites' : 'المفضلة'}
        </Text>

        <View style={styles.favoritesInfo}>
          <Text style={styles.favoritesCount}>
            {user.favoriteEvents.length} {language === 'en' ? 'favorite events' : 'حدث مفضل'}
          </Text>
          <TouchableOpacity
            style={styles.viewFavoritesButton}
            onPress={() => Alert.alert('Info', 'Favorites list would be implemented here')}
          >
            <Text style={styles.viewFavoritesButtonText}>
              {language === 'en' ? 'View All' : 'عرض الكل'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          {language === 'en' ? 'App Information' : 'معلومات التطبيق'}
        </Text>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            {language === 'en' ? 'Version' : 'الإصدار'}
          </Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>
            {language === 'en' ? 'Build' : 'البناء'}
          </Text>
          <Text style={styles.infoValue}>1</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>
          {language === 'en' ? 'Logout' : 'تسجيل الخروج'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.surface,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatarText: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  userName: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  section: {
    margin: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  settingContent: {
    flex: 1,
  },
  settingLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  settingValue: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  settingArrow: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
  },
  favoritesInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
  },
  favoritesCount: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  viewFavoritesButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 6,
  },
  viewFavoritesButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    margin: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    padding: SPACING.xl,
  },
});
