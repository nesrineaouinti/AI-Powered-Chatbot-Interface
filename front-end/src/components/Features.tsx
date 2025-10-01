import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Clock, 
  Globe, 
  Brain, 
  Shield, 
  Heart, 
  Zap 
} from 'lucide-react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, delay }) => {
  return (
    <div 
      className="feature-card glass-effect rounded-2xl p-8 animate-fade-in"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="w-14 h-14 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Clock className="h-7 w-7 text-white" />,
      title: t('features.feature1.title'),
      description: t('features.feature1.description'),
    },
    {
      icon: <Globe className="h-7 w-7 text-white" />,
      title: t('features.feature2.title'),
      description: t('features.feature2.description'),
    },
    {
      icon: <Brain className="h-7 w-7 text-white" />,
      title: t('features.feature3.title'),
      description: t('features.feature3.description'),
    },
    {
      icon: <Shield className="h-7 w-7 text-white" />,
      title: t('features.feature4.title'),
      description: t('features.feature4.description'),
    },
    {
      icon: <Heart className="h-7 w-7 text-white" />,
      title: t('features.feature5.title'),
      description: t('features.feature5.description'),
    },
    {
      icon: <Zap className="h-7 w-7 text-white" />,
      title: t('features.feature6.title'),
      description: t('features.feature6.description'),
    },
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            {t('features.title')}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">99.9%</div>
            <div className="text-muted-foreground">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">1M+</div>
            <div className="text-muted-foreground">Conversations</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">50+</div>
            <div className="text-muted-foreground">Languages</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
            <div className="text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
