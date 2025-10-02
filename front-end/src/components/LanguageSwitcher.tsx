/**
 * Language Switcher Component
 * Allows users to switch between supported languages
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import type { Language } from '@/types/translations';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
  },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'ghost' | 'outline';
  showLabel?: boolean;
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'ghost',
  showLabel = false,
  className = '',
}) => {
  const { language, setLanguage } = useLanguage();
  const { isAuthenticated, updateLanguage } = useAuth();

  const currentLanguage = languages.find((lang) => lang.code === language);

  const handleLanguageChange = async (langCode: Language) => {
    // Update local state immediately for instant UI feedback
    setLanguage(langCode);
    
    // Sync with backend if user is authenticated
    if (isAuthenticated) {
      try {
        await updateLanguage(langCode);
        console.log(`Language preference synced to backend: ${langCode}`);
      } catch (error) {
        console.error('Failed to sync language preference with backend:', error);
        // Language is still changed locally even if backend sync fails
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm" className={`gap-2 ${className}`}>
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="hidden sm:inline">
              {currentLanguage?.nativeName}
            </span>
          )}
          <span className="sm:hidden">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{lang.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{lang.nativeName}</span>
                {lang.name !== lang.nativeName && (
                  <span className="text-xs text-muted-foreground">{lang.name}</span>
                )}
              </div>
            </div>
            {language === lang.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
