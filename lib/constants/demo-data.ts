import { Profile, PostWithAuthor, Community, Notification, Message } from '@/types';

export const DEMO_CURRENT_USER: Profile = {
  id: 'usr_current_01',
  username: 'alexrivera',
  full_name: 'Alex Rivera',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  bio: 'Creative Technologist & Visual Synthesizer. Building at the intersection of AI, design systems, and hyper-modern aesthetics.',
  website: 'https://alexrivera.design',
  location: 'San Francisco, CA',
  is_verified: true,
  followers_count: 14200,
  following_count: 489,
  posts_count: 138,
  created_at: '2025-01-15T08:30:00Z',
  updated_at: '2026-11-20T12:00:00Z',
};

export const DEMO_USERS: Record<string, Profile> = {
  usr_01: {
    id: 'usr_01',
    username: 'elena_vfx',
    full_name: 'Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
    bio: '3D Motion Designer & Unreal Engine artist. Sharing daily procedural experiments and cyberpunk render breakdowns.',
    website: 'https://elena3d.io',
    location: 'Berlin, Germany',
    is_verified: true,
    followers_count: 48200,
    following_count: 312,
    posts_count: 247,
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2026-11-19T14:00:00Z',
  },
  usr_02: {
    id: 'usr_02',
    username: 'kai_zenith',
    full_name: 'Kai Zenith',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    bio: 'Sound architect & modular synth composer. Scoring indie sci-fi games and producing spatial audio.',
    website: 'https://kaizenith.audio',
    location: 'Tokyo, Japan',
    is_verified: true,
    followers_count: 28900,
    following_count: 240,
    posts_count: 89,
    created_at: '2025-03-01T09:00:00Z',
    updated_at: '2026-11-18T16:00:00Z',
  },
  usr_03: {
    id: 'usr_03',
    username: 'maya_codes',
    full_name: 'Maya Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    bio: 'Building open-source AI workflows and GPU acceleration tools. Co-founder of @NeuralCanvas.',
    website: 'https://mayachen.dev',
    location: 'Seattle, WA',
    is_verified: true,
    followers_count: 67100,
    following_count: 620,
    posts_count: 412,
    created_at: '2024-11-05T12:00:00Z',
    updated_at: '2026-11-20T10:00:00Z',
  },
  usr_04: {
    id: 'usr_04',
    username: 'marcus_orbit',
    full_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    bio: 'Astrophotographer & optical engineer. Chasing auroras, eclipses, and nebulas across high-altitude observatories.',
    website: 'https://marcusorbit.photo',
    location: 'Reykjavik, Iceland',
    is_verified: false,
    followers_count: 19800,
    following_count: 180,
    posts_count: 165,
    created_at: '2025-04-12T14:30:00Z',
    updated_at: '2026-11-17T11:20:00Z',
  },
};

export interface StoryItem {
  id: string;
  mediaUrl: string;
  mediaType?: 'image' | 'video';
  caption?: string;
  timeAgo: string;
}

export interface StoryGroup {
  id: string;
  user: Profile;
  isSelf: boolean;
  hasUnseen: boolean;
  mediaUrl?: string; // backwards compatibility
  items: StoryItem[];
}

export const DEMO_STORIES: StoryGroup[] = [
  {
    id: 'story_current',
    user: DEMO_CURRENT_USER,
    isSelf: true,
    hasUnseen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'item_self_1',
        mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&auto=format&fit=crop&q=80',
        caption: 'Working on REELO v2 design tokens & audio engine ⚡',
        timeAgo: 'Just now',
      },
    ],
  },
  {
    id: 'story_01',
    user: DEMO_USERS.usr_01,
    isSelf: false,
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'item_01_1',
        mediaUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1080&auto=format&fit=crop&q=80',
        caption: 'Volumetric lighting bake finished in Unreal Engine 5.5! 🌌',
        timeAgo: '42m ago',
      },
      {
        id: 'item_01_2',
        mediaUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1080&auto=format&fit=crop&q=80',
        caption: 'Behind the scenes: GPU particle simulation at 120 FPS 🔥',
        timeAgo: '1h ago',
      },
    ],
  },
  {
    id: 'story_02',
    user: DEMO_USERS.usr_02,
    isSelf: false,
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'item_02_1',
        mediaUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1080&auto=format&fit=crop&q=80',
        caption: 'Eurorack modular synth jam session in Tokyo 🎛️',
        timeAgo: '2h ago',
      },
      {
        id: 'item_02_2',
        mediaUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1080&auto=format&fit=crop&q=80',
        caption: 'Spatial audio mix calibrated for spatial headphones 🎧',
        timeAgo: '3h ago',
      },
    ],
  },
  {
    id: 'story_03',
    user: DEMO_USERS.usr_03,
    isSelf: false,
    hasUnseen: false,
    mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'item_03_1',
        mediaUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1080&auto=format&fit=crop&q=80',
        caption: 'REELO Dev Hub early access rollouts have begun! 🚀',
        timeAgo: '5h ago',
      },
    ],
  },
  {
    id: 'story_04',
    user: DEMO_USERS.usr_04,
    isSelf: false,
    hasUnseen: true,
    mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop&q=80',
    items: [
      {
        id: 'item_04_1',
        mediaUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1080&auto=format&fit=crop&q=80',
        caption: 'Golden hour drone capture over Lofoten Islands 🏔️',
        timeAgo: '7h ago',
      },
    ],
  },
];

export const DEMO_POSTS: PostWithAuthor[] = [
  {
    id: 'post_01',
    user_id: 'usr_01',
    author: DEMO_USERS.usr_01,
    content: 'Just finalized the procedural neon city generator in Unreal Engine 5.5! 🌌 Over 1.2M custom instanced meshes running at a steady 90 FPS with full Lumen global illumination. What should I add next: subterranean metro lines or dynamic drone traffic?',
    media_urls: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80',
    ],
    media_type: 'image',
    likes_count: 1428,
    comments_count: 132,
    reposts_count: 94,
    community_id: 'comm_02',
    tags: ['Cyberpunk', 'UnrealEngine', 'ProceduralArt', 'ReeloCreators'],
    is_pinned: true,
    user_has_liked: false,
    user_has_reposted: false,
    user_has_bookmarked: true,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45m ago
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'post_02',
    user_id: 'usr_03',
    author: DEMO_USERS.usr_03,
    content: 'Excited to announce REELO Dev Hub! 🚀 We just shipped the first iteration of the unified creator API. Real-time webhooks, instant media encoding, and automatic spatial audio rendering are now live for alpha testers.',
    media_urls: [],
    media_type: 'none',
    likes_count: 3241,
    comments_count: 285,
    reposts_count: 310,
    community_id: 'comm_01',
    tags: ['NextGen', 'DevCommunity', 'WebArchitecture', 'REELO'],
    is_pinned: false,
    user_has_liked: true,
    user_has_reposted: true,
    user_has_bookmarked: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3h ago
    updated_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'post_03',
    user_id: 'usr_02',
    author: DEMO_USERS.usr_02,
    content: 'Recorded this 32-track modular synthesizer loop under the Tokyo rainy skyline last night. Raw analog oscillators tuned to sub-harmonic frequencies. Headphones recommended 🎧✨',
    media_urls: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80',
    ],
    media_type: 'image',
    likes_count: 890,
    comments_count: 67,
    reposts_count: 42,
    community_id: 'comm_03',
    tags: ['ModularSynth', 'ElectronicMusic', 'SoundDesign', 'TokyoNights'],
    is_pinned: false,
    user_has_liked: false,
    user_has_reposted: false,
    user_has_bookmarked: false,
    created_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(), // 6h ago
    updated_at: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  },
  {
    id: 'post_04',
    user_id: 'usr_04',
    author: DEMO_USERS.usr_04,
    content: 'Three consecutive nights at -18°C in the highlands of Iceland rewarded us with this KP7 solar flare storm over the volcanic caldera. Nature will always remain the greatest visual artist.',
    media_urls: [
      'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80',
    ],
    media_type: 'image',
    likes_count: 5120,
    comments_count: 418,
    reposts_count: 670,
    community_id: 'comm_04',
    tags: ['AuroraBorealis', 'Astrophotography', 'Iceland', 'EarthCapture'],
    is_pinned: false,
    user_has_liked: true,
    user_has_reposted: false,
    user_has_bookmarked: true,
    created_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(), // 12h ago
    updated_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  },
];

export const DEMO_COMMUNITIES: Community[] = [
  {
    id: 'comm_01',
    name: 'Future Web & AI Architects',
    slug: 'future-web-ai',
    description: 'A global guild of developers pushing the boundary of decentralized social architectures, edge computing, and real-time LLMs.',
    avatar_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
    creator_id: 'usr_03',
    members_count: 34100,
    is_verified: true,
    category: 'Technology',
    created_at: '2024-10-01T00:00:00Z',
  },
  {
    id: 'comm_02',
    name: 'Cyberpunk & Unreal Explorers',
    slug: 'cyberpunk-unreal',
    description: 'Procedural 3D worldbuilders, shader coders, and virtual production artists sharing tips, assets, and WIP reels.',
    avatar_url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    creator_id: 'usr_01',
    members_count: 22400,
    is_verified: true,
    category: 'Design & 3D',
    created_at: '2024-11-12T00:00:00Z',
  },
  {
    id: 'comm_03',
    name: 'Analog & Modular Audio Lab',
    slug: 'analog-modular-lab',
    description: 'Eurorack enthusiasts, hardware tinkerers, and generative ambient producers dissecting wave shapes and patch cables.',
    avatar_url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
    creator_id: 'usr_02',
    members_count: 14750,
    is_verified: true,
    category: 'Music & Audio',
    created_at: '2025-01-08T00:00:00Z',
  },
  {
    id: 'comm_04',
    name: 'Deep Space & Earth Observatories',
    slug: 'deep-space-earth',
    description: 'High-res cosmos captures, deep-sky tracking rigs, telescope optical alignments, and nocturnal expeditions.',
    avatar_url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=200&auto=format&fit=crop&q=80',
    banner_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
    creator_id: 'usr_04',
    members_count: 18900,
    is_verified: false,
    category: 'Science',
    created_at: '2025-02-20T00:00:00Z',
  },
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif_01',
    user_id: 'usr_current_01',
    actor_id: 'usr_01',
    actor: DEMO_USERS.usr_01,
    type: 'like',
    post_id: 'post_01',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  },
  {
    id: 'notif_02',
    user_id: 'usr_current_01',
    actor_id: 'usr_03',
    actor: DEMO_USERS.usr_03,
    type: 'comment',
    post_id: 'post_02',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: 'notif_03',
    user_id: 'usr_current_01',
    actor_id: 'usr_02',
    actor: DEMO_USERS.usr_02,
    type: 'follow',
    post_id: null,
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'notif_04',
    user_id: 'usr_current_01',
    actor_id: 'usr_04',
    actor: DEMO_USERS.usr_04,
    type: 'repost',
    post_id: 'post_04',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 420).toISOString(),
  },
];

export const DEMO_MESSAGES: Message[] = [
  {
    id: 'msg_01',
    sender_id: 'usr_01',
    recipient_id: 'usr_current_01',
    sender: DEMO_USERS.usr_01,
    content: 'Hey Alex! Did you get a chance to inspect the new procedural shader graph we deployed?',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'msg_02',
    sender_id: 'usr_current_01',
    recipient_id: 'usr_01',
    sender: DEMO_CURRENT_USER,
    content: 'Yes! The performance optimization on the volumetric fog pass is incredible. 40% reduction in frame time.',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'msg_03',
    sender_id: 'usr_01',
    recipient_id: 'usr_current_01',
    sender: DEMO_USERS.usr_01,
    content: 'That is huge! Let us sync tomorrow to record the walkthrough for the community.',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
];
