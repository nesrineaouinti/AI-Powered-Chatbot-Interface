import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useAuth } from '@/contexts/AuthContext';
import { Spinner } from '@/components/ui/Spinner';

// ---------------- Zod Schema ----------------
const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

const SignIn: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { login, googleLogin, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setAuthError('');
    try {
      await login({ username_or_email: data.email, password: data.password });
      navigate('/chatbot');
    } catch (err: any) {
      setAuthError(err.backendMessage || 'Invalid credentials');
    }
  };

  const handleGoogleSuccess = async (token: string) => {
    try {
      await googleLogin(token, language as 'en' | 'ar');
      navigate('/chatbot');
    } catch (err: any) {
      setAuthError(t('errors.googleAuthFailed'));
    }
  };

  const handleGoogleError = () => {
    setAuthError(t('errors.googleAuthFailed'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 pt-24">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-lg">{t('auth.signIn.subtitle')}</p>
        </div>

        <Card className="glass-effect border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.signIn.title')}</CardTitle>
            <CardDescription>{t('auth.signIn.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.fields.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('auth.fields.emailPlaceholder')}
                    {...register('email')}
                    className="pl-10"
                  />
                </div>
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t('auth.fields.password')}</Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.fields.passwordPlaceholder')}
                    {...register('password')}
                    className="pl-10 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                asChild={false} // important: render real <button>
                className="w-full flex items-center justify-center"
                size="lg"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? <Spinner /> : t('auth.signIn.button')}
                {!isSubmitting && !loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>

              {/* Error */}
              {authError && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
                </div>
              )}
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t('auth.options.orContinueWith')}</span>
              </div>
            </div>

            {/* Google Login */}
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={handleGoogleError} text="signin_with" />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t('auth.signIn.noAccount')}{' '}
              <Link to="/signup" className="text-primary font-medium hover:underline">
                {t('navigation.signup')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
