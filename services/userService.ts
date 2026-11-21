import { Profile } from '@/types';

export const userService = {
  /**
   * Retrieve a user profile from local PC database API by their unique username.
   */
  async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(username.toLowerCase().trim())}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      return data.profile as Profile;
    } catch (err) {
      console.error('Error fetching profile from local PC API:', err);
      return null;
    }
  },

  /**
   * Update the profile of the current user in local PC database.
   */
  async updateProfile(profileUpdates: Partial<Profile>): Promise<{ profile: Profile | null; error: string | null }> {
    try {
      const res = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileUpdates),
      });
      const data = await res.json();
      if (!res.ok) {
        return { profile: null, error: data.error || 'Failed to update profile.' };
      }
      return { profile: data.profile as Profile, error: null };
    } catch (err: any) {
      return { profile: null, error: err.message || 'Failed to update profile.' };
    }
  },

  /**
   * Toggle follow/unfollow status for a target user in local PC database.
   */
  async toggleFollow(targetUsername: string): Promise<{ following: boolean; error: string | null }> {
    try {
      const res = await fetch(`/api/users/${encodeURIComponent(targetUsername.toLowerCase().trim())}/follow`, {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        return { following: false, error: data.error || 'Follow request failed.' };
      }
      return { following: Boolean(data.following), error: null };
    } catch (err: any) {
      return { following: false, error: err.message || 'Follow request failed.' };
    }
  },
};
