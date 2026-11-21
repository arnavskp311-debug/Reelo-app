import { Profile } from '@/types';

export interface AuthResponse {
  user: Profile | null;
  error: string | null;
}

export const authService = {
  /**
   * Register a new user account stored directly in the local PC database.
   */
  async signUp(email: string, password: string, username: string, fullName: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
          username: username.toLowerCase().trim(),
          fullName: fullName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        return { user: null, error: data.error || 'Signup failed.' };
      }

      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('reelo_active_user', JSON.stringify(data.user));
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Unable to connect to local auth service.' };
    }
  },

  /**
   * Sign in to an account stored in the local PC database.
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        return { user: null, error: data.error || 'Invalid credentials.' };
      }

      if (typeof window !== 'undefined' && data.user) {
        localStorage.setItem('reelo_active_user', JSON.stringify(data.user));
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Unable to connect to local auth service.' };
    }
  },

  /**
   * Sign out and clear active session.
   */
  async signOut(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.warn('Logout fetch warning:', err);
    }

    if (typeof window !== 'undefined') {
      localStorage.removeItem('reelo_active_user');
    }
  },

  /**
   * Get the active authenticated profile from local session.
   */
  async getCurrentUser(): Promise<Profile | null> {
    if (typeof window !== 'undefined') {
      // Check cached profile first for instant UI response
      const cached = localStorage.getItem('reelo_active_user');
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch {
          localStorage.removeItem('reelo_active_user');
        }
      }

      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            localStorage.setItem('reelo_active_user', JSON.stringify(data.user));
            return data.user;
          }
        }
      } catch (err) {
        console.warn('Failed to fetch active session:', err);
      }
    }

    return null;
  },
};
