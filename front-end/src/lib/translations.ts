import enTranslations from '@/locales/en.json';
import arTranslations from '@/locales/ar.json';
import type { Translations } from '@/types/translations';
// Translation utility for accessing localized messages
export type Language = 'en' | 'ar';

export interface ValidationMessages {
  required: string;
  email: string;
  username: {
    min: string;
    max: string;
    pattern: string;
  };
  password: {
    min: string;
    max: string;
    uppercase: string;
    lowercase: string;
    number: string;
    special: string;
  };
  passwordMatch: string;
}

export interface TranslationData {
  validation: ValidationMessages;
  [key: string]: any;
}

// Simple translation loader
class TranslationManager {
  private translations: Map<Language, Translations> = new Map();

  constructor() {
    // Initialize translations synchronously
    this.translations.set('en', enTranslations as Translations);
    this.translations.set('ar', arTranslations as Translations);
  }

  getValidationMessages(lang: Language = 'en'): ValidationMessages {
    const translation = this.translations.get(lang);
    if (!translation?.errors?.validation) {
      throw new Error(`Validation messages not found for language: ${lang}`);
    }
    return translation.errors.validation;
  }
}

export const translationManager = new TranslationManager();
export const getValidationMessages = (lang: Language = 'en'): ValidationMessages => {
  return translationManager.getValidationMessages(lang);
};
