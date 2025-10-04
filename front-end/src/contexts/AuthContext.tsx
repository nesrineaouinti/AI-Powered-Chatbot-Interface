import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, User, LoginCredentials, SignupData } from '@/services/authService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  submitting: boolean; 
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  googleLogin: (token: string, languagePreference?: 'en' | 'ar') => Promise<void>;
  logout: () => Promise<void>;
  updateLanguage: (language: 'en' | 'ar') => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // button-level loading

  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedUser = authService.getUser();
        const accessToken = authService.getAccessToken();

        if (savedUser && accessToken) {
          // Verify token is still valid by fetching user data
          try {
            const userData = await authService.getProfile(accessToken);
            setUser(userData);
            authService.saveUser(userData);
          } catch (err) {
            // Token expired or invalid, clear auth
            authService.clearAuth();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setSubmitting(true);
      setError(null);
  
      const response = await authService.login(credentials);
  
      authService.saveTokens(response.tokens);
      authService.saveUser(response.user);
      setUser(response.user);
    } catch (err: any) {
      console.log("LOGIN ERROR:", err.response?.data);
      let backendMsg = 'Login failed';
  
      // Handle common Django REST error formats
      if (err.response?.data) {
        const data = err.response.data;
  
        // Priority 1: if the API returned "error"
        if (typeof data.error === 'string') {
          backendMsg = data.error;
        }

        // Priority 3: fallback for validation errors { field: ["message"] }
        else if (typeof data === 'object') {
          const firstKey = Object.keys(data)[0];
          if (firstKey && Array.isArray(data[firstKey])) {
            backendMsg = data[firstKey][0];
          }
        }
      }
  
      setError(backendMsg);
  
      // attach backend message for UI-specific handling (optional)
      err.backendMessage = backendMsg;
  
      throw err; // rethrow to allow form-level handling
    } finally {
      setSubmitting(false);
    }
  };
  


  const signup = async (data: SignupData) => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await authService.signup(data);

      authService.saveTokens(response.tokens);
      authService.saveUser(response.user);
      setUser(response.user);
    } catch (err: any) {
      const errorMsg = err.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const googleLogin = async (googleToken: string, languagePreference?: 'en' | 'ar') => {
    try {
      setSubmitting(true);
      setError(null);
      const response = await authService.googleAuth({
        token: googleToken,
        language_preference: languagePreference,
      });

      authService.saveTokens(response.tokens);
      authService.saveUser(response.user);
      setUser(response.user);
    } catch (err: any) {
      const errorMsg = err.message || 'Google authentication failed';
      setError(errorMsg);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();

      if (accessToken && refreshToken) {
        try {
          await authService.logout(refreshToken, accessToken);
        } catch (err) {
          console.error('Logout API error:', err);
        }
      }

      authService.clearAuth();
      setUser(null);
      setError(null);
      navigate('/signin');
    } catch (err: any) {
      authService.clearAuth();
      setUser(null);
      navigate('/signin');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateLanguage = async (language: 'en' | 'ar') => {
    try {
      setLoading(true);
      const accessToken = authService.getAccessToken();

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await authService.updateProfile(accessToken, {
        language_preference: language,
      });

      authService.saveUser(updatedUser);
      setUser(updatedUser);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update language';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      const accessToken = authService.getAccessToken();

      if (!accessToken) {
        throw new Error('Not authenticated');
      }

      const updatedUser = await authService.updateProfile(accessToken, data);

      authService.saveUser(updatedUser);
      setUser(updatedUser);
      setError(null);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update profile';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    try {
      const accessToken = authService.getAccessToken();

      if (!accessToken) {
        return;
      }

      const userData = await authService.getProfile(accessToken);
      authService.saveUser(userData);
      setUser(userData);
    } catch (err) {
      console.error('Failed to refresh user data:', err);
      // If refresh fails, token might be expired
      authService.clearAuth();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    submitting,
    error,
    isAuthenticated: !!user,
    login,
    signup,
    googleLogin,
    logout,
    updateLanguage,
    updateProfile,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;
