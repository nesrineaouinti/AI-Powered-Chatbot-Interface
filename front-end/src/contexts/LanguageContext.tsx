import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Translations, Language } from '@/types/translations';
import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';

// Storage key for persisting language preference
const LANGUAGE_STORAGE_KEY = 'app_language_preference';

// Translation resources
const translationResources: Record<Language, Translations> = {
  en: enTranslations as Translations,
  ar: arTranslations as Translations,
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
  translations: Translations;
  syncLanguageFromUser: (userLanguage: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/**
 * Get a nested value from an object using dot notation
 * Example: getNestedValue(obj, 'auth.signIn.title')
 */
const getNestedValue = (obj: any, path: string): string | undefined => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return undefined;
    }
  }
  
  return typeof current === 'string' ? current : undefined;
};

/**
 * Load language preference from localStorage
 */
const loadLanguagePreference = (): Language => {
  try {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored === 'en' || stored === 'ar') {
      return stored;
    }
  } catch (error) {
    console.error('Failed to load language preference:', error);
  }
  
  // Default to browser language if available
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('ar')) {
    return 'ar';
  }
  
  return 'en';
};

/**
 * Save language preference to localStorage
 */
const saveLanguagePreference = (language: Language): void => {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Failed to save language preference:', error);
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(loadLanguagePreference);
  const [translations, setTranslations] = useState<Translations>(
    translationResources[loadLanguagePreference()]
  );

  // Update translations and persist language preference when language changes
  useEffect(() => {
    setTranslations(translationResources[language]);
    saveLanguagePreference(language);
    
    // Update document direction and lang attribute
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  /**
   * Sync language from user profile (when user logs in)
   * This updates the language and saves to localStorage
   * Backend preference takes priority over localStorage
   */
  const syncLanguageFromUser = (userLanguage: Language) => {
    if (userLanguage !== language) {
      setLanguageState(userLanguage);
      saveLanguagePreference(userLanguage);
    }
  };

  /**
   * Translation function with dot notation support
   * Example: t('auth.signIn.title') or t('navigation.home')
   */
  const t = (key: string): string => {
    const value = getNestedValue(translations, key);
    
    if (value !== undefined) {
      return value;
    }
    
    // Fallback: try to get from English if current language doesn't have the key
    if (language !== 'en') {
      const fallbackValue = getNestedValue(translationResources.en, key);
      if (fallbackValue !== undefined) {
        console.warn(`Translation missing for key "${key}" in language "${language}", using English fallback`);
        return fallbackValue;
      }
    }
    
    // Return the key itself if no translation found
    console.warn(`Translation missing for key "${key}"`);
    return key;
  };

  const isRTL = language === 'ar';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL, translations, syncLanguageFromUser }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
