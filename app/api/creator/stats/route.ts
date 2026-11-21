import { NextRequest, NextResponse } from 'next/server';
import { getDb, getServerSessionUserId } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const db = getDb();
    const userId = getServerSessionUserId(request);

    // Profile counters
    const profile = db.prepare('SELECT * FROM profiles WHERE id = ?').get(userId) as any;

    if (!profile) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sum of likes and comments
    const aggregate = db.prepare(`
      SELECT 
        COUNT(*) as total_posts,
        COALESCE(SUM(likes_count), 0) as total_likes,
        COALESCE(SUM(comments_count), 0) as total_comments,
        COALESCE(SUM(reposts_count), 0) as total_reposts
      FROM posts 
      WHERE user_id = ?
    `).get(userId) as any;

    // Top posts
    const topPosts = db.prepare(`
      SELECT id, content, media_urls, media_type, likes_count, comments_count, created_at
      FROM posts
      WHERE user_id = ?
      ORDER BY likes_count DESC, comments_count DESC
      LIMIT 5
    `).all(userId) as any[];

    // User badges
    const badges = db.prepare(`
      SELECT * FROM user_badges WHERE user_id = ? ORDER BY unlocked_at DESC
    `).all(userId) as any[];

    const totalEngagements = (aggregate?.total_likes || 0) + (aggregate?.total_comments || 0) + (aggregate?.total_reposts || 0);
    const estimatedImpressions = Math.max(totalEngagements * 14 + (profile.followers_count || 0) * 8, 120);
    const engagementRate = estimatedImpressions > 0 ? ((totalEngagements / estimatedImpressions) * 100).toFixed(1) : '0.0';

    return NextResponse.json({
      stats: {
        total_posts: aggregate?.total_posts || profile.posts_count || 0,
        total_likes: aggregate?.total_likes || 0,
        total_comments: aggregate?.total_comments || 0,
        total_reposts: aggregate?.total_reposts || 0,
        followers_count: profile.followers_count || 0,
        following_count: profile.following_count || 0,
        estimated_impressions: estimatedImpressions,
        engagement_rate: `${engagementRate}%`,
      },
      top_posts: topPosts.map((p) => {
        let media = [];
        try { media = JSON.parse(p.media_urls || '[]'); } catch {}
        return {
          id: p.id,
          content: p.content,
          thumbnail: media[0] || null,
          media_type: p.media_type,
          likes: p.likes_count,
          comments: p.comments_count,
          created_at: p.created_at,
        };
      }),
      badges: badges.map((b) => ({
        id: b.id,
        key: b.badge_key,
        name: b.badge_name,
        description: b.badge_description,
        icon: b.badge_icon,
        unlocked_at: b.unlocked_at,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching creator analytics:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
