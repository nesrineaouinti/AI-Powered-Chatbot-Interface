import { z } from 'zod';
import { getValidationMessages } from '../lib/translations';

/**

/**
 * Sign In Schema
 */
export const signInSchema = (lang: 'en' | 'ar' = 'en') => {
  const messages = getValidationMessages(lang);
  
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
  const messages = getValidationMessages(lang);
  
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
  const messages = getValidationMessages(lang);
  
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
  const messages = getValidationMessages(lang);
  
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
