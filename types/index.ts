import { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type PostRow = Database['public']['Tables']['posts']['Row'];
export type Like = Database['public']['Tables']['likes']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'] & {
  profile?: Profile;
};
export type Follow = Database['public']['Tables']['follows']['Row'];
export type Community = Database['public']['Tables']['communities']['Row'];
export type Message = Database['public']['Tables']['messages']['Row'] & {
  sender?: Profile;
  recipient?: Profile;
};
export type Notification = Database['public']['Tables']['notifications']['Row'] & {
  actor?: Profile;
  post?: PostRow;
};

export interface PostWithAuthor extends PostRow {
  author: Profile;
  user_has_liked?: boolean;
  user_has_reposted?: boolean;
  user_has_bookmarked?: boolean;
}

export type FeedFilter = 'for-you' | 'following' | 'reels' | 'trending';

export interface UserStats {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  reelsCount: number;
}
