import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useApp } from '../../store/AppContext';
import { SafeArea } from '../../components';
import { styles } from './ProfileScreen.styles';

export default function ProfileScreen() {
  const navigation = useNavigation();
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

  const handleViewFavorites = () => {
    // Navigate to favorites screen
    Alert.alert('Info', 'Favorites screen navigation would be implemented here');
  };

  if (!user) {
    return (
      <SafeArea>
        <View style={styles.container}>
          <Text style={styles.errorText}>
            {language === 'en' ? 'User not found' : 'المستخدم غير موجود'}
          </Text>
        </View>
      </SafeArea>
    );
  }

  return (
    <SafeArea>
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
              onPress={handleViewFavorites}
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
    </SafeArea>
  );
}
