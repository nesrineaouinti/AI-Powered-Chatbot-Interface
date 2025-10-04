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
  const { signup, googleLogin, submitting } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema(language as 'en' | 'ar')),
    mode: 'onBlur',
  });

  const parseSignupError = (err: any): string => {
    try {
      const data = err.response?.data || JSON.parse(err.message || '{}');

      if (data.email) return t('errors.emailAlreadyExists');
      if (data.username) return data.username[0];
      if (data.password) return t('errors.weakPassword');
    } catch {
      return t('errors.signupFailed');
    }
    return t('errors.signupFailed');
  };

  const onSubmit = async (formData: SignUpFormData) => {
    setAuthError('');
    try {
      await signup({
        ...formData,
        language_preference: language as 'en' | 'ar',
      });
      navigate('/chatbot');
    } catch (err: any) {
      setAuthError(parseSignupError(err));
    }
  };

  const handleGoogleSuccess = async (token: string) => {
    setAuthError('');
    try {
      await googleLogin(token, language as 'en' | 'ar');
      navigate('/chatbot');
    } catch {
      setAuthError(t('errors.googleAuthFailed'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg py-12 px-4 pt-24">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <p className="text-muted-foreground text-lg">{t('auth.signUp.subtitle')}</p>
        </div>

        <Card className="glass-effect border-white/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle className="text-2xl">{t('auth.signUp.title')}</CardTitle>
            <CardDescription>{t('auth.signUp.description')}</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Username */}
              <InputField
                id="username"
                label={t('auth.fields.username')}
                icon={<User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
                placeholder={t('auth.fields.usernamePlaceholder')}
                error={errors.username?.message}
                {...register('username')}
              />

              {/* Email */}
              <InputField
                id="email"
                label={t('auth.fields.email')}
                icon={<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
                placeholder={t('auth.fields.emailPlaceholder')}
                error={errors.email?.message}
                {...register('email')}
              />

              {/* Password */}
              <PasswordField
                id="password"
                label={t('auth.fields.password')}
                placeholder={t('auth.fields.passwordPlaceholder')}
                show={showPassword}
                toggleShow={() => setShowPassword(prev => !prev)}
                error={errors.password?.message}
                {...register('password')}
              />

              {/* Confirm Password */}
              <PasswordField
                id="password_confirm"
                label={t('auth.fields.confirmPassword')}
                placeholder={t('auth.fields.passwordPlaceholder')}
                show={showConfirmPassword}
                toggleShow={() => setShowConfirmPassword(prev => !prev)}
                error={errors.password_confirm?.message}
                {...register('password_confirm')}
              />

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-4 h-4 mt-1 rounded border-input text-primary focus:ring-2 focus:ring-primary"
                  required
                />
                <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                  {t('auth.terms.agreeToTerms')}{' '}
                  <Link to="/terms" className="text-primary hover:underline">{t('auth.terms.termsOfService')}</Link>{' '}
                  {t('auth.terms.and')}{' '}
                  <Link to="/privacy" className="text-primary hover:underline">{t('auth.terms.privacyPolicy')}</Link>
                </Label>
              </div>

              {/* Submit */}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || submitting}>
                {(isSubmitting || submitting) ? t('auth.signUp.creating') : t('auth.signUp.button')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              {/* Error */}
              {authError && <ErrorMessage message={authError} />}
            </form>

            {/* Divider */}
            <Divider text={t('auth.options.orSignUpWith')} />

            {/* Google Sign Up */}
            <GoogleLoginButton onSuccess={handleGoogleSuccess} onError={() => setAuthError(t('errors.googleAuthFailed'))} text="signup_with" />
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              {t('auth.signUp.haveAccount')} <Link to="/signin" className="text-primary font-medium hover:underline">{t('navigation.login')}</Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// ----------- Helper Components -----------
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ReactNode;
  error?: string;
}
const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(({ label, icon, error, ...props }, ref) => (
  <div className="space-y-2">
    <Label htmlFor={props.id}>{label}</Label>
    <div className="relative">
      {icon}
      <Input {...props} className={`pl-10 ${error ? 'border-red-500' : ''}`} ref={ref} />
    </div>
    {error && <FieldError message={error} />}
  </div>
));

interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  show: boolean;
  toggleShow: () => void;
  error?: string;
}
const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(({ label, show, toggleShow, error, ...props }, ref) => (
  <div className="space-y-2">
    <Label htmlFor={props.id}>{label}</Label>
    <div className="relative">
      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input {...props} type={show ? 'text' : 'password'} className={`pl-10 pr-10 ${error ? 'border-red-500' : ''}`} ref={ref} />
      <button type="button" onClick={toggleShow} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {error && <FieldError message={error} />}
  </div>
));

const FieldError: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-1 text-red-500 text-sm">
    <AlertCircle className="h-3 w-3" />
    <span>{message}</span>
  </div>
);

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
    <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
  </div>
);

const Divider: React.FC<{ text: string }> = ({ text }) => (
  <div className="relative my-6">
    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
    <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">{text}</span></div>
  </div>
);

export default SignUp;
