import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nManager } from 'react-native';
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

// Function to change language and handle RTL
export const changeLanguage = async (language: 'en' | 'ar') => {
  const isRTL = language === 'ar';
  
  // Force RTL layout change
  if (I18nManager.isRTL !== isRTL) {
    I18nManager.forceRTL(isRTL);
    // Note: On iOS, you need to restart the app for RTL to take effect
    // On Android, it works immediately
  }
  
  await i18n.changeLanguage(language);
};

// Get current language
export const getCurrentLanguage = () => i18n.language;

// Check if current language is RTL
export const isRTL = () => I18nManager.isRTL;

export default i18n;
