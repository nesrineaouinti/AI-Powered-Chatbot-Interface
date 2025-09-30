import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  User,
  MessageSquare,
  Bot,
  Calendar,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  Edit,
  Sparkles,
} from 'lucide-react';

const Profile: React.FC = () => {
  const { t, isRTL } = useLanguage();

  // Mock user data (replace with actual user data from context/API)
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    memberSince: 'January 2024',
    totalChats: 127,
    favoriteModel: 'GPT-4',
    avatar: null,
  };

  // Mock AI-generated summary (replace with actual AI-generated content)
  const aiSummary = {
    en: {
      overview: 'Based on your interactions, you are a curious learner with a strong interest in technology and programming. You frequently ask about web development, AI concepts, and best practices in software engineering.',
      interests: [
        'Web Development',
        'Artificial Intelligence',
        'React & TypeScript',
        'UI/UX Design',
        'Software Architecture',
      ],
      commonQueries: [
        'How to implement authentication in React?',
        'Best practices for TypeScript',
        'Explaining AI concepts',
        'Code optimization techniques',
        'Design patterns in software development',
      ],
    },
    ar: {
      overview: 'بناءً على تفاعلاتك، أنت متعلم فضولي لديك اهتمام قوي بالتكنولوجيا والبرمجة. تسأل بشكل متكرر عن تطوير الويب ومفاهيم الذكاء الاصطناعي وأفضل الممارسات في هندسة البرمجيات.',
      interests: [
        'تطوير الويب',
        'الذكاء الاصطناعي',
        'React و TypeScript',
        'تصميم واجهة المستخدم',
        'هندسة البرمجيات',
      ],
      commonQueries: [
        'كيفية تنفيذ المصادقة في React؟',
        'أفضل الممارسات لـ TypeScript',
        'شرح مفاهيم الذكاء الاصطناعي',
        'تقنيات تحسين الكود',
        'أنماط التصميم في تطوير البرمجيات',
      ],
    },
  };

  const currentSummary = isRTL ? aiSummary.ar : aiSummary.en;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('myProfile')}</h1>
          <p className="text-muted-foreground">
            {isRTL
              ? 'عرض وإدارة معلومات ملفك الشخصي'
              : 'View and manage your profile information'}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl">{userData.name}</CardTitle>
                <CardDescription>{userData.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  {t('editProfile')}
                </Button>
                <Button className="w-full" variant="outline">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  {t('settings')}
                </Button>
                <Button className="w-full" variant="destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('logout')}
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{isRTL ? 'الإحصائيات' : 'Statistics'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('totalChats')}</span>
                  </div>
                  <span className="font-bold">{userData.totalChats}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('favoriteModel')}</span>
                  </div>
                  <span className="font-bold">{userData.favoriteModel}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('memberSince')}</span>
                  </div>
                  <span className="font-bold text-sm">{userData.memberSince}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Summary */}
          <div className="md:col-span-2 space-y-6">
            {/* AI-Generated Summary */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>{t('aiSummary')}</CardTitle>
                </div>
                <CardDescription>
                  {isRTL
                    ? 'ملخص تم إنشاؤه بواسطة الذكاء الاصطناعي بناءً على محادثاتك'
                    : 'AI-generated insights based on your conversations'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                    {currentSummary.overview}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Interests */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>{t('interests')}</CardTitle>
                </div>
                <CardDescription>
                  {isRTL
                    ? 'المواضيع التي تتفاعل معها بشكل متكرر'
                    : 'Topics you frequently engage with'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {currentSummary.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Queries */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>{t('commonQueries')}</CardTitle>
                </div>
                <CardDescription>
                  {isRTL
                    ? 'أكثر الأسئلة التي تطرحها'
                    : 'Your most frequent questions'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {currentSummary.commonQueries.map((query, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-sm">{query}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Activity Insights */}
            <Card>
              <CardHeader>
                <CardTitle>{isRTL ? 'رؤى النشاط' : 'Activity Insights'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-600 mb-1">87%</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'معدل الرضا' : 'Satisfaction Rate'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/20">
                    <div className="text-2xl font-bold text-green-600 mb-1">42</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'متوسط الرسائل/محادثة' : 'Avg Messages/Chat'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-600 mb-1">15</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'أيام النشاط' : 'Active Days'}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
                    <div className="text-2xl font-bold text-orange-600 mb-1">3.2k</div>
                    <div className="text-sm text-muted-foreground">
                      {isRTL ? 'إجمالي الرسائل' : 'Total Messages'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
