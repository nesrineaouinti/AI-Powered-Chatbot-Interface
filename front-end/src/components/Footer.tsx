/**
 * Footer Component
 * Displays footer with copyright and build information
 * Supports RTL and translations
 */

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 py-8 border-t">
      <div className="container mx-auto px-4">
        <div className="text-center text-muted-foreground">
          <p>&copy; {currentYear} {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
