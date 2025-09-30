'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Custom hook to protect routes that require authentication
 * Redirects to login page if user is not authenticated
 */
export const useAuthProtection = (redirectTo: string = '/login') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
};

/**
 * Custom hook to redirect authenticated users away from auth pages
 * Useful for login/signup pages
 */
export const useRedirectIfAuthenticated = (redirectTo: string = '/dashboard') => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(redirectTo);
    }
  }, [user, loading, router, redirectTo]);

  return { user, loading };
};
