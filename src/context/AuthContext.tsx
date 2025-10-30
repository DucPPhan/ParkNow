// src/context/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { setTokenExpiredCallback } from '../services/api';
import { resetToLogin } from '../navigation/RootNavigation';

interface AuthContextType {
  isLoading: boolean;
  userToken: string | null;
  hasSeenOnboarding: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Kiểm tra trạng thái khi app khởi động
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        
        // Kiểm tra xem đã xem onboarding chưa
        const onboardingStatus = await SecureStore.getItemAsync('hasSeenOnboarding');
        setHasSeenOnboarding(onboardingStatus === 'true');
        
        // Kiểm tra token
        const token = await SecureStore.getItemAsync('userToken');
        setUserToken(token);
        
        console.log('Auth Status:', {
          hasSeenOnboarding: onboardingStatus === 'true',
          hasToken: !!token,
        });
      } catch (error) {
        console.error('Error checking auth status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();

    // Setup callback cho token hết hạn: clear token and force navigate to Login
    setTokenExpiredCallback(() => {
      console.log('Token expired callback triggered');
      // clear local state and secure store
      setUserToken(null);
      // attempt to navigate to Login screen (reset stack)
      try {
        resetToLogin();
      } catch (err) {
        console.error('Failed to reset navigation to Login on token expiry:', err);
      }
    });
  }, []);

  const authContext: AuthContextType = {
    isLoading,
    userToken,
    hasSeenOnboarding,
    
    signIn: async (token: string) => {
      try {
        await SecureStore.setItemAsync('userToken', token);
        setUserToken(token);
      } catch (error) {
        console.error('Error signing in:', error);
        throw error;
      }
    },
    
    signOut: async () => {
      try {
        await SecureStore.deleteItemAsync('userToken');
        setUserToken(null);
      } catch (error) {
        console.error('Error signing out:', error);
        throw error;
      }
    },
    
    completeOnboarding: async () => {
      try {
        await SecureStore.setItemAsync('hasSeenOnboarding', 'true');
        setHasSeenOnboarding(true);
      } catch (error) {
        console.error('Error completing onboarding:', error);
        throw error;
      }
    },
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
