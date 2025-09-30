/**
 * Environment Configuration
 * Centralized access to environment variables
 */

export const env = {
  // Google OAuth
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // Environment
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
} as const;

// Validate required environment variables
const validateEnv = () => {
  const required = {
    VITE_GOOGLE_CLIENT_ID: env.googleClientId,
    VITE_API_BASE_URL: env.apiBaseUrl,
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.warn(
      `⚠️ Missing environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file.'
    );
  }
};

// Run validation in development
if (env.isDevelopment) {
  validateEnv();
}

export default env;
