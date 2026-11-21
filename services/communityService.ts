import { Community } from '@/types';
import { supabase } from '@/lib/supabase/client';

export const communityService = {
  /**
   * Fetch all communities from Supabase PostgreSQL.
   */
  async getCommunities(): Promise<Community[]> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('members_count', { ascending: false });

      if (error || !data) {
        console.error('Error fetching communities from Supabase:', error);
        return [];
      }

      return data as Community[];
    } catch (err) {
      console.error('Error in communityService.getCommunities:', err);
      return [];
    }
  },

  /**
   * Fetch a single community by its unique slug from Supabase.
   */
  async getCommunityBySlug(slug: string): Promise<Community | null> {
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        return null;
      }

      return data as Community;
    } catch (err) {
      console.error('Error in communityService.getCommunityBySlug:', err);
      return null;
    }
  },
};
