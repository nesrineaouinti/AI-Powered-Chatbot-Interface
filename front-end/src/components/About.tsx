import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Target, Eye, Users, Award } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section id="about" className="py-24 bg-gradient-to-b from-secondary/20 to-background">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              {t('about.title')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Side - Image/Illustration */}
            <div className="relative">
              <div className="glass-effect rounded-3xl p-8 aspect-square flex items-center justify-center">
                <div className="relative w-full h-full">
                  {/* Animated circles */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 bg-gradient-to-br from-purple-600/40 to-pink-600/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-gradient-to-br from-pink-600/50 to-primary/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                  </div>
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-2xl">
                      <Users className="h-10 w-10 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Text Content */}
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-foreground">
                {t('about.description')}
              </p>
              
              <div className="space-y-4 pt-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('about.mission.title')}</h3>
                    <p className="text-muted-foreground">{t('about.mission.description')}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{t('about.vision.title')}</h3>
                    <p className="text-muted-foreground">{t('about.vision.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-effect rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('about.stats.industryLeading.title')}</h3>
              <p className="text-muted-foreground">{t('about.stats.industryLeading.description')}</p>
            </div>

            <div className="glass-effect rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('about.stats.users.title')}</h3>
              <p className="text-muted-foreground">{t('about.stats.users.description')}</p>
            </div>

            <div className="glass-effect rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Target className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">{t('about.stats.satisfaction.title')}</h3>
              <p className="text-muted-foreground">{t('about.stats.satisfaction.description')}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
