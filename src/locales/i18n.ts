import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Alert, Platform } from 'react-native';
import en from './en';
import ar from './ar';

// Configure i18n
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ar: {
        translation: ar,
      },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

// Professional RTL management with app restart
export const changeLanguage = async (language: 'en' | 'ar') => {
  const isRTL = language === 'ar';
  
  // Check if RTL change is needed
  if (I18nManager.isRTL !== isRTL) {
    // Show restart alert for iOS
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Restart Required',
        'The app needs to restart to apply the language change.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Restart',
            style: 'destructive',
            onPress: () => {
              // Force RTL change
              I18nManager.forceRTL(isRTL);
              // Note: On iOS, user needs to manually restart the app
              // This is the professional approach used by major apps
            },
          },
        ]
      );
    } else {
      // Android: RTL works immediately
      I18nManager.forceRTL(isRTL);
    }
  }
  
  // Change the language
  await i18n.changeLanguage(language);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Check if current language is RTL
export const isRTL = () => I18nManager.isRTL;

export default i18n;
