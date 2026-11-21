import { Community } from '@/types';
import { DEMO_COMMUNITIES } from '@/lib/constants/demo-data';

export const communityService = {
  async getCommunities(): Promise<Community[]> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/communities', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.communities) return data.communities;
        }
      } catch (err) {
        console.warn('Local communities API fetch failed:', err);
      }
    }

    return DEMO_COMMUNITIES;
  },

  async getCommunityBySlug(slug: string): Promise<Community | null> {
    const list = await this.getCommunities();
    return list.find((c) => c.slug === slug) || null;
  },
};
