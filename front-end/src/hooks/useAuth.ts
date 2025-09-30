import { useState, useEffect } from 'react';
import { authService, User, AuthTokens, LoginCredentials, SignupData, GoogleAuthData } from '@/services/authService';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (response: { user: User; tokens: AuthTokens }) => {
    authService.saveTokens(response.tokens);
    authService.saveUser(response.user);
    setUser(response.user);
    setError(null);
  };

  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.signup(data);
      handleAuthSuccess(response);
      return response;
    } catch (err: any) {
      const errorMsg = err.message || 'Signup failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      handleAuthSuccess(response);
      return response;
    } catch (err: any) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async (googleToken: string, languagePreference?: 'en' | 'ar') => {
    try {
      setLoading(true);
      setError(null);
      const data: GoogleAuthData = {
        token: googleToken,
        language_preference: languagePreference,
      };
      const response = await authService.googleAuth(data);
      handleAuthSuccess(response);
      return response;
    } catch (err: any) {
      const errorMsg = err.message || 'Google authentication failed';
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      const accessToken = authService.getAccessToken();
      const refreshToken = authService.getRefreshToken();
      
      if (accessToken && refreshToken) {
        await authService.logout(refreshToken, accessToken);
      }
      
      authService.clearAuth();
      setUser(null);
      setError(null);
    } catch (err: any) {
      // Even if logout fails on server, clear local data
      authService.clearAuth();
      setUser(null);
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
      return updatedUser;
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to update language';
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
    }
  };

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    signup,
    login,
    googleLogin,
    logout,
    updateLanguage,
    refreshUserData,
  };
};

export default useAuth;
