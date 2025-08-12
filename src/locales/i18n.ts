import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Alert, Platform } from 'react-native';
import RNRestart from 'react-native-restart';
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

// Professional RTL management with automatic restart
export const changeLanguage = async (language: 'en' | 'ar') => {
  const isRTL = language === 'ar';
  
  // Check if RTL change is needed
  if (I18nManager.isRTL !== isRTL) {
    // Force RTL change
    I18nManager.forceRTL(isRTL);
    
    // Show restart alert
    Alert.alert(
      'Restart Required',
      'The app will restart to apply the language change.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Restart Now',
          style: 'destructive',
          onPress: () => {
            // Automatically restart the app
            RNRestart.Restart();
          },
        },
      ]
    );
  }
  
  // Change the language
  await i18n.changeLanguage(language);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Check if current language is RTL
export const isRTL = () => I18nManager.isRTL;

export default i18n;
