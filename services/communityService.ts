import { Community } from '@/types';

export const communityService = {
  /**
   * Fetch all communities from local PC database API.
   */
  async getCommunities(): Promise<Community[]> {
    try {
      const res = await fetch('/api/communities', { cache: 'no-store' });
      if (!res.ok) {
        console.error('Error fetching communities from local PC API:', res.statusText);
        return [];
      }
      const data = await res.json();
      return (data.communities || []) as Community[];
    } catch (err) {
      console.error('Error in communityService.getCommunities:', err);
      return [];
    }
  },

  /**
   * Fetch a single community by its unique slug from local PC database API.
   */
  async getCommunityBySlug(slug: string): Promise<Community | null> {
    try {
      const communities = await this.getCommunities();
      return communities.find((c) => c.slug === slug) || null;
    } catch (err) {
      console.error('Error in communityService.getCommunityBySlug:', err);
      return null;
    }
  },
};
