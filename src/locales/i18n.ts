import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager, Alert } from 'react-native';
import * as Updates from 'expo-updates';
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

// Professional RTL management with app reload
export const changeLanguage = async (language: 'en' | 'ar') => {
  const isRTL = language === 'ar';
  
  // Check if RTL change is needed
  if (I18nManager.isRTL !== isRTL) {
    // Force RTL change
    I18nManager.forceRTL(isRTL);
    
    // Show reload alert
    Alert.alert(
      'Reload Required',
      'The app will reload to apply the language change.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reload Now',
          style: 'destructive',
          onPress: async () => {
            try {
              // Reload the app using expo-updates
              await Updates.reloadAsync();
            } catch (error) {
              console.log('Reload failed, falling back to manual restart');
              // Fallback: user needs to manually restart
              Alert.alert(
                'Manual Restart Required',
                'Please close and reopen the app to apply changes.'
              );
            }
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
