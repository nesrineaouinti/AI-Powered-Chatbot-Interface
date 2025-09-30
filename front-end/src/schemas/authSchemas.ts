import { z } from 'zod';

/**
 * Authentication Validation Schemas with Localized Error Messages
 */

// Error messages in English and Arabic
export const errorMessages = {
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    username: {
      min: 'Username must be at least 3 characters',
      max: 'Username must be at most 20 characters',
      pattern: 'Username can only contain letters, numbers, and underscores',
    },
    password: {
      min: 'Password must be at least 8 characters',
      max: 'Password must be at most 128 characters',
      uppercase: 'Password must contain at least one uppercase letter',
      lowercase: 'Password must contain at least one lowercase letter',
      number: 'Password must contain at least one number',
      special: 'Password must contain at least one special character',
    },
    passwordMatch: 'Passwords do not match',
  },
  ar: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال عنوان بريد إلكتروني صالح',
    username: {
      min: 'يجب أن يكون اسم المستخدم 3 أحرف على الأقل',
      max: 'يجب ألا يتجاوز اسم المستخدم 20 حرفًا',
      pattern: 'يمكن أن يحتوي اسم المستخدم على أحرف وأرقام وشرطات سفلية فقط',
    },
    password: {
      min: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل',
      max: 'يجب ألا تتجاوز كلمة المرور 128 حرفًا',
      uppercase: 'يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل',
      lowercase: 'يجب أن تحتوي كلمة المرور على حرف صغير واحد على الأقل',
      number: 'يجب أن تحتوي كلمة المرور على رقم واحد على الأقل',
      special: 'يجب أن تحتوي كلمة المرور على حرف خاص واحد على الأقل',
    },
    passwordMatch: 'كلمات المرور غير متطابقة',
  },
};

// Get error messages based on language
export const getErrorMessages = (lang: 'en' | 'ar' = 'en') => errorMessages[lang];

/**
 * Sign In Schema
 */
export const signInSchema = (lang: 'en' | 'ar' = 'en') => {
  const messages = getErrorMessages(lang);
  
  return z.object({
    username_or_email: z
      .string()
      .min(1, messages.required)
      .trim(),
    password: z
      .string()
      .min(1, messages.required),
  });
};

export type SignInFormData = z.infer<ReturnType<typeof signInSchema>>;

/**
 * Sign Up Schema
 */
export const signUpSchema = (lang: 'en' | 'ar' = 'en') => {
  const messages = getErrorMessages(lang);
  
  return z.object({
    username: z
      .string()
      .min(3, messages.username.min)
      .max(20, messages.username.max)
      .regex(/^[a-zA-Z0-9_]+$/, messages.username.pattern)
      .trim(),
    
    email: z
      .string()
      .min(1, messages.required)
      .email(messages.email)
      .trim()
      .toLowerCase(),
    
    password: z
      .string()
      .min(8, messages.password.min)
      .max(128, messages.password.max)
      .regex(/[A-Z]/, messages.password.uppercase)
      .regex(/[a-z]/, messages.password.lowercase)
      .regex(/[0-9]/, messages.password.number)
      .regex(/[^A-Za-z0-9]/, messages.password.special),
    
    password_confirm: z
      .string()
      .min(1, messages.required),
    
    language_preference: z.enum(['en', 'ar']).optional(),
  }).refine((data) => data.password === data.password_confirm, {
    message: messages.passwordMatch,
    path: ['password_confirm'],
  });
};

export type SignUpFormData = z.infer<ReturnType<typeof signUpSchema>>;

/**
 * Change Password Schema
 */
export const changePasswordSchema = (lang: 'en' | 'ar' = 'en') => {
  const messages = getErrorMessages(lang);
  
  return z.object({
    old_password: z
      .string()
      .min(1, messages.required),
    
    new_password: z
      .string()
      .min(8, messages.password.min)
      .max(128, messages.password.max)
      .regex(/[A-Z]/, messages.password.uppercase)
      .regex(/[a-z]/, messages.password.lowercase)
      .regex(/[0-9]/, messages.password.number)
      .regex(/[^A-Za-z0-9]/, messages.password.special),
    
    new_password_confirm: z
      .string()
      .min(1, messages.required),
  }).refine((data) => data.new_password === data.new_password_confirm, {
    message: messages.passwordMatch,
    path: ['new_password_confirm'],
  });
};

export type ChangePasswordFormData = z.infer<ReturnType<typeof changePasswordSchema>>;

/**
 * Profile Update Schema
 */
export const profileUpdateSchema = (lang: 'en' | 'ar' = 'en') => {
  const messages = getErrorMessages(lang);
  
  return z.object({
    username: z
      .string()
      .min(3, messages.username.min)
      .max(20, messages.username.max)
      .regex(/^[a-zA-Z0-9_]+$/, messages.username.pattern)
      .trim()
      .optional(),
    
    email: z
      .string()
      .email(messages.email)
      .trim()
      .toLowerCase()
      .optional(),
    
    first_name: z.string().max(50).optional(),
    last_name: z.string().max(50).optional(),
    language_preference: z.enum(['en', 'ar']).optional(),
  });
};

export type ProfileUpdateFormData = z.infer<ReturnType<typeof profileUpdateSchema>>;
