import { Profile } from '@/types';
import { supabase } from '@/lib/supabase/client';

export const userService = {
  /**
   * Retrieve a user profile from Supabase PostgreSQL by their unique username.
   */
  async getProfileByUsername(username: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username.toLowerCase().trim())
        .single();

      if (error || !data) {
        return null;
      }

      return data as Profile;
    } catch (err) {
      console.error('Error fetching profile from Supabase:', err);
      return null;
    }
  },

  /**
   * Update the profile of the currently authenticated Supabase user.
   */
  async updateProfile(profileUpdates: Partial<Profile>): Promise<{ profile: Profile | null; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { profile: null, error: 'Authentication required to update profile.' };
      }

      const { data, error } = await (supabase
        .from('profiles') as any)
        .update({
          ...profileUpdates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { profile: null, error: error.message };
      }

      return { profile: data as Profile, error: null };
    } catch (err: any) {
      return { profile: null, error: err.message || 'Failed to update profile.' };
    }
  },

  /**
   * Toggle follow/unfollow status for a target user in Supabase.
   */
  async toggleFollow(targetUsername: string): Promise<{ following: boolean; error: string | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        return { following: false, error: 'Authentication required to follow users.' };
      }

      const targetProfile = await this.getProfileByUsername(targetUsername);
      if (!targetProfile) {
        return { following: false, error: 'Target user not found.' };
      }

      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetProfile.id)
        .maybeSingle();

      if (existingFollow && (existingFollow as any).id) {
        await supabase
          .from('follows')
          .delete()
          .eq('id', (existingFollow as any).id);

        return { following: false, error: null };
      } else {
        await supabase
          .from('follows')
          .insert({
            follower_id: user.id,
            following_id: targetProfile.id,
          } as any);

        return { following: true, error: null };
      }
    } catch (err: any) {
      return { following: false, error: err.message || 'Follow request failed.' };
    }
  },
};
