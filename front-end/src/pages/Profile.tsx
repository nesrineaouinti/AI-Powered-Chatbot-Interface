import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import EditProfileDialog from '@/components/EditProfileDialog';
import {
  User,
  MessageSquare,
  Bot,
  Calendar,
  TrendingUp,
  LogOut,
  Edit,
  Sparkles,
} from 'lucide-react';
import { chatService } from '@/services/chatService';
import { UserSummary } from '@/types/chat';

const Profile: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const { user, logout } = useAuth();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [summary, setSummary] = useState<UserSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!user) return;
      try {
        setLoadingSummary(true);
        let summaryData: UserSummary | null = null;

        if (user?.summary_id) {
          summaryData = await chatService.getSummary(user.summary_id);
        }

        if (!summaryData) {
          const generateResponse = await chatService.generateSummary({ userId: user.id });
          summaryData = generateResponse.summary;
        }

        setSummary(summaryData);
      } catch (err) {
        console.error('Failed to load summary:', err);
        setError(t('profile.errorLoadingSummary'));
      } finally {
        setLoadingSummary(false);
      }
    };

    fetchSummary();
  }, [user, t]);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t('profile.myProfile')}</h1>
          <p className="text-muted-foreground">{t('profile.profileDescription')}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            {/* Profile Card */}
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  {user?.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
                      <User className="h-12 w-12 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {user?.first_name && user?.last_name
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username || t('profile.userPlaceholder')}
                </CardTitle>
                <CardDescription>{user?.email || t('profile.noEmail')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('profile.actions.editProfile')}
                </Button>
                <Button className="w-full" variant="destructive" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('navigation.logout')}
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{t('profile.stats.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('profile.stats.totalChats')}</span>
                  </div>
                  <span className="font-bold">{summary?.message_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bot className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('profile.stats.favoriteModel')}</span>
                  </div>
                  <span className="font-bold">{summary?.ai_model_used}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-sm">{t('profile.stats.memberSince')}</span>
                  </div>
                  <span className="font-bold text-sm">
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString(isRTL ? 'ar' : 'en', {
                          year: 'numeric',
                          month: 'long',
                        })
                      : 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* AI Summary */}
            <Card className="border-primary/20">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <CardTitle>{t('profile.aiSummary')}</CardTitle>
                </div>
                <CardDescription>{t('profile.aiSummaryDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingSummary ? (
                  <p>{t('profile.loading')}</p>
                ) : error ? (
                  <p className="text-red-500">{error}</p>
                ) : summary ? (
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-foreground leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
                      {summary.summary_text}
                    </p>
                  </div>
                ) : (
                  <p>{t('profile.noSummary')}</p>
                )}
              </CardContent>
            </Card>

            {/* Interests */}
            {summary?.topics && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>{t('profile.interests')}</CardTitle>
                  </div>
                  <CardDescription>{t('profile.interestsDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {summary.topics.map((interest, index) => (
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
            )}

            {/* Common Queries */}
            {summary?.common_queries && (
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <CardTitle>{t('profile.commonQueries')}</CardTitle>
                  </div>
                  <CardDescription>{t('profile.commonQueriesDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {summary.common_queries.map((query, index) => (
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
            )}
          </div>
        </div>

        <EditProfileDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />
      </div>
    </div>
  );
};

export default Profile;
