export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          is_verified: boolean;
          followers_count: number;
          following_count: number;
          posts_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          is_verified?: boolean;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          is_verified?: boolean;
          followers_count?: number;
          following_count?: number;
          posts_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          media_urls: string[];
          media_type: 'image' | 'video' | 'reel' | 'none';
          likes_count: number;
          comments_count: number;
          reposts_count: number;
          community_id: string | null;
          tags: string[];
          is_pinned: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          media_urls?: string[];
          media_type?: 'image' | 'video' | 'reel' | 'none';
          likes_count?: number;
          comments_count?: number;
          reposts_count?: number;
          community_id?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          media_urls?: string[];
          media_type?: 'image' | 'video' | 'reel' | 'none';
          likes_count?: number;
          comments_count?: number;
          reposts_count?: number;
          community_id?: string | null;
          tags?: string[];
          is_pinned?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          parent_id: string | null;
          likes_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          content: string;
          parent_id?: string | null;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          content?: string;
          parent_id?: string | null;
          likes_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      follows: {
        Row: {
          id: string;
          follower_id: string;
          following_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          follower_id: string;
          following_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          follower_id?: string;
          following_id?: string;
          created_at?: string;
        };
      };
      communities: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          avatar_url: string | null;
          banner_url: string | null;
          creator_id: string;
          members_count: number;
          is_verified: boolean;
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          creator_id: string;
          members_count?: number;
          is_verified?: boolean;
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          avatar_url?: string | null;
          banner_url?: string | null;
          creator_id?: string;
          members_count?: number;
          is_verified?: boolean;
          category?: string;
          created_at?: string;
        };
      };
      community_members: {
        Row: {
          id: string;
          community_id: string;
          user_id: string;
          role: 'admin' | 'moderator' | 'member';
          joined_at: string;
        };
        Insert: {
          id?: string;
          community_id: string;
          user_id: string;
          role?: 'admin' | 'moderator' | 'member';
          joined_at?: string;
        };
        Update: {
          id?: string;
          community_id?: string;
          user_id?: string;
          role?: 'admin' | 'moderator' | 'member';
          joined_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          is_read?: boolean;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          actor_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'repost';
          post_id: string | null;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          actor_id: string;
          type: 'like' | 'comment' | 'follow' | 'mention' | 'repost';
          post_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          actor_id?: string;
          type?: 'like' | 'comment' | 'follow' | 'mention' | 'repost';
          post_id?: string | null;
          is_read?: boolean;
          created_at?: string;
        };
      };
    };
  };
}
