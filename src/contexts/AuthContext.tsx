'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { firebaseAuth } from '@/lib/firebase';
import apiClient from '@/helpers/apiClient';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ user: User | null; error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: string | null }>;
  signInWithGoogle: () => Promise<{ user: User | null; error: string | null }>;
  signOut: () => Promise<{ error: string | null }>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  getIdToken: (forceRefresh?: boolean) => Promise<{ token: string | null; error: string | null }>;
  sendVerificationEmail: () => Promise<{ error: string | null }>;
  setupRecaptcha: (containerId: string) => { verifier: RecaptchaVerifier | null; error: string | null };
  sendPhoneOTP: (phoneNumber: string, verifier: RecaptchaVerifier) => Promise<{ confirmationResult: ConfirmationResult | null; error: string | null }>;
  verifyPhoneOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<{ user: User | null; error: string | null }>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = firebaseAuth.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    signUp: async (email: string, password: string, name: string) => {
      const result = await firebaseAuth.signUp(email, password);
      if (result.user) {
        // Update user profile with name
        await firebaseAuth.updateUserProfile(result.user, name);
        // Sync with backend
        try {
          await apiClient.post('/auth/signup', { name });
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
        }
      }
      return result;
    },
    signIn: async (email: string, password: string) => {
      const result = await firebaseAuth.signIn(email, password);
      if (result.user) {
        // Notify backend about login
        try {
          await apiClient.post('/auth/signin/email');
        } catch (error) {
          console.error('Failed to notify backend about login:', error);
        }
      }
      return result;
    },
    signInWithGoogle: async () => {
      const result = await firebaseAuth.signInWithGoogle();
      if (result.user) {
        // Sync with backend
        try {
          await apiClient.post('/auth/signin/google');
        } catch (error) {
          console.error('Failed to sync Google user with backend:', error);
        }
      }
      return result;
    },
    signOut: async () => {
      const result = await firebaseAuth.signOut();
      if (!result.error) {
        setUser(null);
      }
      return result;
    },
    resetPassword: firebaseAuth.resetPassword,
    getIdToken: firebaseAuth.getIdToken,
    sendVerificationEmail: async () => {
      if (!user) {
        return { error: 'No user logged in' };
      }
      return await firebaseAuth.sendVerificationEmail(user);
    },
    setupRecaptcha: firebaseAuth.setupRecaptcha,
    sendPhoneOTP: firebaseAuth.sendPhoneOTP,
    verifyPhoneOTP: async (confirmationResult: ConfirmationResult, otp: string) => {
      const result = await firebaseAuth.verifyPhoneOTP(confirmationResult, otp);
      if (result.user) {
        // Sync with backend
        try {
          await apiClient.post('/auth/signin/phone');
        } catch (error) {
          console.error('Failed to sync phone user with backend:', error);
        }
      }
      return result;
    },
    updateProfile: async (displayName: string, photoURL?: string) => {
      if (!user) {
        return { error: 'No user logged in' };
      }
      const result = await firebaseAuth.updateUserProfile(user, displayName, photoURL);
      if (!result.error) {
        // Update backend
        try {
          await apiClient.put('/auth/profile', { name: displayName });
        } catch (error) {
          console.error('Failed to update profile in backend:', error);
        }
      }
      return result;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
