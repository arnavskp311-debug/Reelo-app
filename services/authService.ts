import { Profile } from '@/types';
import { DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export interface AuthResponse {
  user: Profile | null;
  error: string | null;
  isDemo?: boolean;
}

export const authService = {
  async signUp(email: string, password: string, username: string, fullName: string): Promise<AuthResponse> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, username, fullName }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('reelo_active_user', JSON.stringify(data.user));
          return { user: data.user, error: null };
        }
        return { user: null, error: data.error || 'Signup failed.' };
      } catch (err: any) {
        return { user: null, error: err.message || 'Signup connection error.' };
      }
    }

    return { user: null, error: 'Auth unavailable' };
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.user) {
          localStorage.setItem('reelo_active_user', JSON.stringify(data.user));
          return { user: data.user, error: null };
        }
      } catch (err) {
        console.warn('Local login API error, falling back:', err);
      }
    }

    return { user: DEMO_CURRENT_USER, error: null };
  },

  async signOut(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('reelo_active_user');
    }
  },

  async getCurrentUser(): Promise<Profile | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) return data.user;
        }
      } catch (err) {
        console.warn('Failed to fetch /api/auth/me:', err);
      }
    }

    return DEMO_CURRENT_USER;
  },
};
