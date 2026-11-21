import { Profile } from '@/types';
import { DEMO_USERS, DEMO_CURRENT_USER } from '@/lib/constants/demo-data';

export const userService = {
  async getProfileByUsername(username: string): Promise<Profile | null> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/users/${username}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.profile) return data.profile;
        }
      } catch (err) {
        console.warn('Local user API fetch error:', err);
      }
    }

    if (username.toLowerCase() === DEMO_CURRENT_USER.username.toLowerCase()) {
      return DEMO_CURRENT_USER;
    }

    const found = Object.values(DEMO_USERS).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    return found || null;
  },

  async updateProfile(profileUpdates: Partial<Profile>): Promise<{ profile: Profile | null; error: string | null }> {
    if (typeof window !== 'undefined') {
      try {
        const username = DEMO_CURRENT_USER.username;
        const res = await fetch(`/api/users/${username}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profileUpdates),
        });
        const data = await res.json();
        if (res.ok && data.profile) {
          return { profile: data.profile, error: null };
        }
        return { profile: null, error: data.error || 'Failed to update profile.' };
      } catch (err: any) {
        return { profile: null, error: err.message || 'Profile update failed.' };
      }
    }

    const updated = { ...DEMO_CURRENT_USER, ...profileUpdates, updated_at: new Date().toISOString() };
    return { profile: updated, error: null };
  },

  async toggleFollow(username: string): Promise<{ following: boolean; error: string | null }> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/users/${username}/follow`, {
          method: 'POST',
        });
        const data = await res.json();
        if (res.ok) {
          return { following: data.following, error: null };
        }
        return { following: false, error: data.error || 'Failed to toggle follow' };
      } catch (err: any) {
        return { following: false, error: err.message || 'Follow request error' };
      }
    }
    return { following: true, error: null };
  },
};
