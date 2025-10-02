import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { 
  Menu, 
  X, 
  MessageSquare, 
  User, 
  LogIn, 
  UserPlus, 
  LogOut,
  Bot
} from 'lucide-react';

const Navigation: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    if (!isLandingPage) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMobileMenuOpen(false);
  };


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">AI Chatbot</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-8`}>
            <button
              onClick={() => scrollToSection('home')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('navigation.home')}
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('navigation.features')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              {t('navigation.about')}
            </button>
          </div>

          {/* Desktop Actions */}
          <div className={`hidden md:flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-4`}>
            {/* Language Switcher */}
            <LanguageSwitcher variant="ghost" showLabel={false} />

            {/* Chat Access - Only show if authenticated */}
            {isAuthenticated && (
              <Button variant="outline" className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/chatbot')}>
                <MessageSquare className="h-4 w-4" />
                <span>{t('navigation.chatbot')}</span>
              </Button>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    {user?.profile_picture ? (
                      <img 
                        src={user.profile_picture} 
                        alt={user.username}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={isRTL ? 'start' : 'end'}>
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user?.username}
                  </div>
                  <DropdownMenuItem className={`cursor-pointer gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/profile')}>
                    <User className="h-4 w-4" />
                    <span>{t('navigation.profile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className={`cursor-pointer text-red-600 gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="outline" className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/signin')}>
                  <LogIn className="h-4 w-4" />
                  {t('navigation.login')}
                </Button>
                <Button className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => navigate('/signup')}>
                  <UserPlus className="h-4 w-4" />
                  {t('navigation.signup')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className={`md:hidden flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
            <LanguageSwitcher variant="ghost" showLabel={false} />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-lg mt-2 p-4 shadow-xl">
            <button
              onClick={() => scrollToSection('home')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
            >
              {t('navigation.home')}
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
            >
              {t('navigation.features')}
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="block w-full text-left px-4 py-2 text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
            >
              {t('navigation.about')}
            </button>
            <div className="border-t pt-4 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* User info */}
                  <div className="px-4 py-2 bg-accent rounded-md">
                    <div className={`flex items-center ${isRTL ? 'space-x-reverse' : ''} space-x-2`}>
                      {user?.profile_picture ? (
                        <img 
                          src={user.profile_picture} 
                          alt={user.username}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-8 w-8" />
                      )}
                      <span className="font-medium">{user?.username}</span>
                    </div>
                  </div>
                  <Button variant="outline" className={`w-full gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => { navigate('/chatbot'); setIsMobileMenuOpen(false); }}>
                    <MessageSquare className="h-4 w-4" />
                    <span>{t('navigation.chatbot')}</span>
                  </Button>
                  <Button variant="outline" className={`w-full gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); }}>
                    <User className="h-4 w-4" />
                    <span>{t('navigation.profile')}</span>
                  </Button>
                  <Button variant="destructive" className={`w-full gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>{t('navigation.logout')}</span>
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="default" className={`w-full gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => { navigate('/signin'); setIsMobileMenuOpen(false); }}>
                    <LogIn className="h-4 w-4" />
                    <span>{t('navigation.login')}</span>
                  </Button>
                  <Button variant="secondary" className={`w-full gap-2 ${isRTL ? 'flex-row-reverse' : ''}`} onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}>
                    <UserPlus className="h-4 w-4" />
                    <span>{t('navigation.signup')}</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
