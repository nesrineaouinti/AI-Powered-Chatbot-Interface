/**
 * LanguageSync Component
 * Syncs user's language preference from backend when they log in
 * This component doesn't render anything, it just handles the sync logic
 */

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageSync: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { syncLanguageFromUser } = useLanguage();

  useEffect(() => {
    // When user logs in, sync their language preference from backend
    if (isAuthenticated && user?.language_preference) {
      syncLanguageFromUser(user.language_preference);
    }
  }, [isAuthenticated, user?.language_preference, syncLanguageFromUser]);

  return null;
};

export default LanguageSync;
