'use client';

import { useState, useEffect } from 'react';
import { Profile } from '@/types';
import { authService } from '@/services/authService';
import { isSupabaseConfigured } from '@/lib/supabase/config';

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isSupabaseConfigured());

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Failed to load user:', err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    const res = await authService.signIn(email, pass);
    if (res.user) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const signup = async (email: string, pass: string, username: string, fullName: string) => {
    setLoading(true);
    const res = await authService.signUp(email, pass, username, fullName);
    if (res.user) {
      setUser(res.user);
    }
    setLoading(false);
    return res;
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    isDemo,
    login,
    signup,
    logout,
    setUser,
  };
}
