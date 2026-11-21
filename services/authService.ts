import { Profile } from '@/types';
import { supabase } from '@/lib/supabase/client';

export interface AuthResponse {
  user: Profile | null;
  error: string | null;
}

export const authService = {
  /**
   * Register a new user with Supabase Auth and initialize their cloud profile.
   */
  async signUp(email: string, password: string, username: string, fullName: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username.toLowerCase().trim(),
            full_name: fullName.trim(),
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.toLowerCase().trim()}`,
          },
        },
      });

      if (authError) {
        return { user: null, error: authError.message };
      }

      if (!authData.user) {
        return { user: null, error: 'Registration failed. No user was returned.' };
      }

      // Fetch or insert profile in Supabase public.profiles
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (existingProfile) {
        return { user: existingProfile as Profile, error: null };
      }

      const newProfile: Profile = {
        id: authData.user.id,
        username: username.toLowerCase().trim(),
        full_name: fullName.trim(),
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username.toLowerCase().trim()}`,
        banner_url: null,
        bio: '',
        location: '',
        website: '',
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await supabase.from('profiles').insert(newProfile as any);

      return { user: newProfile, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'An unexpected error occurred during signup.' };
    }
  },

  /**
   * Authenticate a user with Supabase Auth using email and password.
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (!data.user) {
        return { user: null, error: 'User account not found.' };
      }

      // Fetch user profile from Supabase PostgreSQL
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError || !profile) {
        // Fallback to user metadata if profile row trigger is pending
        const meta = data.user.user_metadata || {};
        const fallbackProfile: Profile = {
          id: data.user.id,
          username: meta.username || data.user.email?.split('@')[0] || 'user',
          full_name: meta.full_name || 'REELO Member',
          avatar_url: meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
          banner_url: null,
          bio: '',
          location: '',
          website: '',
          is_verified: false,
          followers_count: 0,
          following_count: 0,
          posts_count: 0,
          created_at: data.user.created_at,
          updated_at: data.user.created_at,
        };
        return { user: fallbackProfile, error: null };
      }

      return { user: profile as Profile, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Unable to connect to authentication service.' };
    }
  },

  /**
   * Terminate current session via Supabase Auth.
   */
  async signOut(): Promise<void> {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Supabase sign out error:', err);
    }
  },

  /**
   * Retrieve the currently authenticated user profile from Supabase.
   */
  async getCurrentUser(): Promise<Profile | null> {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        return null;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        return profile as Profile;
      }

      const meta = user.user_metadata || {};
      return {
        id: user.id,
        username: meta.username || user.email?.split('@')[0] || 'user',
        full_name: meta.full_name || 'REELO Member',
        avatar_url: meta.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`,
        banner_url: null,
        bio: '',
        location: '',
        website: '',
        is_verified: false,
        followers_count: 0,
        following_count: 0,
        posts_count: 0,
        created_at: user.created_at,
        updated_at: user.created_at,
      };
    } catch {
      return null;
    }
  },
};
