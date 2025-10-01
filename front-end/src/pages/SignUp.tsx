import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, AlertCircle } from 'lucide-react';
import GoogleLoginButton from '@/components/GoogleLoginButton';
import { useAuth } from '@/contexts/AuthContext';
import { signUpSchema, type SignUpFormData } from '@/schemas/authSchemas';

const SignUp: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { signup, googleLogin, loading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Initialize react-hook-form with Zod validation
  const {
    register,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema(language as 'en' | 'ar')),
    mode: 'onBlur',
  });

  const parseSignupError = (err: any): string => {
    try {
      const errorData = JSON.parse(err.message || '{}');
      
      // Check for specific field errors
      if (errorData.email) {
        const emailError = errorData.email[0].toLowerCase();
        if (emailError.includes('already') || emailError.includes('exists')) {
          return t('errors.emailAlreadyExists');
        }
        return errorData.email[0];
      }
      
      if (errorData.username) {
        return errorData.username[0];
      }
      
      if (errorData.password) {
        const passwordError = errorData.password[0].toLowerCase();
        if (passwordError.includes('weak') || passwordError.includes('common')) {
          return t('errors.weakPassword');
        }
        return errorData.password[0];
      }
      
      // Handle response data errors
      if (err?.response?.data) {
        const data = err.response.data;
        if (data.error) {
          const errorMsg = data.error.toLowerCase();
          if (errorMsg.includes('email') && errorMsg.includes('exists')) {
            return t('errors.emailAlreadyExists');
          }
        }
      }
    } catch {
      // Parsing failed, use default error
    }
    
    return t('errors.signupFailed');
  };

  const onSubmit = async (data: SignUpFormData) => {
    setAuthError('');

    try {
      await signup({
        username: data.username,
        email: data.email,
        password: data.password,
        password_confirm: data.password_confirm,
        language_preference: data.language_preference || (language as 'en' | 'ar'),
      });
      navigate('/chatbot');
    } catch (err: any) {
      const errorMessage = parseSignupError(err);
      setAuthError(errorMessage);
      console.error('Signup error:', err);
    }
  };

  const handleGoogleSuccess = async (token: string) => {
    try {
      await googleLogin(token);
      navigate('/chatbot');
    } catch (err: any) {
      setAuthError(t('errors.googleAuthFailed'));
      console.error('Google auth error:', err);
    }
  };

  const handleGoogleError = () => {
    setAuthError(t('errors.googleAuthFailed'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 pt-24">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Welcome Message */}
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-lg">{t('signUpSubtitle')}</p>
        </div>

        {/* Sign Up Card */}
        <Card className="glass-effect border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">{t('signUpTitle')}</CardTitle>
            <CardDescription>
              {t('signUpDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className={`pl-10 ${errors.username ? 'border-red-500' : ''}`}
                    {...register('username')}
                  />
                </div>
                {errors.username && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.username.message}</span>
                  </div>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                    {...register('email')}
                  />
                </div>
                {errors.email && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.email.message}</span>
                  </div>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.password.message}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">{t('passwordHint')}</p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password_confirm">{t('confirmPassword')}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password_confirm"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('passwordPlaceholder')}
                    className={`pl-10 pr-10 ${errors.password_confirm ? 'border-red-500' : ''}`}
                    {...register('password_confirm')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password_confirm && (
                  <div className="flex items-center gap-1 text-red-500 text-sm">
                    <AlertCircle className="h-3 w-3" />
                    <span>{errors.password_confirm.message}</span>
                  </div>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                  {t('agreeToTerms')}{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    {t('termsOfService')}
                  </Link>{' '}
                  {t('and')}{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    {t('privacyPolicy')}
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || loading}>
                {(isSubmitting || loading) ? 'Creating account...' : t('createAccountButton')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            {/* Error Message */}
            {authError && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">
                  {authError}
                </p>
              </div>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">{t('orSignUpWith')}</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <div className="mb-4">
              <GoogleLoginButton
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                text="signup_with"
              />
            </div>

            {/* GitHub Sign Up (placeholder) */}
            <Button variant="outline" type="button" className="w-full" disabled>
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              {t('github')} (Coming Soon)
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t('haveAccount')}{' '}
              <Link to="/signin" className="text-primary font-medium hover:underline">
                {t('login')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
