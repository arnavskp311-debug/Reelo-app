const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'reelo.db');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA foreign_keys = ON;');
db.exec('PRAGMA journal_mode = WAL;');

db.exec(`
  CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    bio TEXT,
    website TEXT,
    location TEXT,
    is_verified INTEGER DEFAULT 0,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS communities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    avatar_url TEXT,
    banner_url TEXT,
    creator_id TEXT NOT NULL,
    members_count INTEGER DEFAULT 1,
    is_verified INTEGER DEFAULT 0,
    category TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    media_urls TEXT DEFAULT '[]',
    media_type TEXT DEFAULT 'none',
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    reposts_count INTEGER DEFAULT 0,
    community_id TEXT,
    tags TEXT DEFAULT '[]',
    is_pinned INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS likes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(user_id, post_id),
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    parent_id TEXT,
    likes_count INTEGER DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS follows (
    id TEXT PRIMARY KEY,
    follower_id TEXT NOT NULL,
    following_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    UNIQUE(follower_id, following_id)
  );

  CREATE TABLE IF NOT EXISTS community_members (
    id TEXT PRIMARY KEY,
    community_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    role TEXT DEFAULT 'member',
    joined_at TEXT NOT NULL,
    UNIQUE(community_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    type TEXT NOT NULL,
    post_id TEXT,
    is_read INTEGER DEFAULT 0,
    created_at TEXT NOT NULL
  );
`);

const insertProfile = db.prepare(`
  INSERT OR REPLACE INTO profiles (
    id, username, full_name, avatar_url, banner_url, bio, website, location,
    is_verified, followers_count, following_count, posts_count, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertProfile.run(
  'usr_current_01',
  'alexrivera',
  'Alex Rivera',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'Creative Technologist & Visual Synthesizer. Building at the intersection of AI, design systems, and hyper-modern aesthetics.',
  'https://alexrivera.design',
  'San Francisco, CA',
  1,
  14200,
  489,
  138,
  new Date().toISOString(),
  new Date().toISOString()
);

insertProfile.run(
  'usr_01',
  'elena_vfx',
  'Elena Rostova',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=1200&auto=format&fit=crop&q=80',
  '3D Motion Designer & Unreal Engine artist. Sharing daily procedural experiments and cyberpunk render breakdowns.',
  'https://elena3d.io',
  'Berlin, Germany',
  1,
  48200,
  312,
  247,
  new Date().toISOString(),
  new Date().toISOString()
);

insertProfile.run(
  'usr_02',
  'kai_zenith',
  'Kai Zenith',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'Sound architect & modular synth composer. Scoring indie sci-fi games and producing spatial audio.',
  'https://kaizenith.audio',
  'Tokyo, Japan',
  1,
  28900,
  240,
  89,
  new Date().toISOString(),
  new Date().toISOString()
);

insertProfile.run(
  'usr_03',
  'maya_codes',
  'Maya Chen',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
  'Building open-source AI workflows and GPU acceleration tools. Co-founder of @NeuralCanvas.',
  'https://mayachen.dev',
  'Seattle, WA',
  1,
  67100,
  620,
  412,
  new Date().toISOString(),
  new Date().toISOString()
);

insertProfile.run(
  'usr_04',
  'marcus_orbit',
  'Marcus Vance',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80',
  'Astrophotographer & optical engineer. Chasing auroras, eclipses, and nebulas across high-altitude observatories.',
  'https://marcusorbit.photo',
  'Reykjavik, Iceland',
  0,
  19800,
  180,
  165,
  new Date().toISOString(),
  new Date().toISOString()
);

const insertComm = db.prepare(`
  INSERT OR REPLACE INTO communities (
    id, name, slug, description, avatar_url, banner_url, creator_id,
    members_count, is_verified, category, created_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertComm.run(
  'comm_01',
  'Future Web & AI Architects',
  'future-web-ai',
  'A global guild of developers pushing the boundary of decentralized social architectures, edge computing, and real-time LLMs.',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'usr_03',
  34100,
  1,
  'Technology',
  new Date().toISOString()
);

insertComm.run(
  'comm_02',
  'Cyberpunk & Unreal Explorers',
  'cyberpunk-unreal',
  'Procedural 3D worldbuilders, shader coders, and virtual production artists sharing tips, assets, and WIP reels.',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
  'usr_01',
  22400,
  1,
  'Design & 3D',
  new Date().toISOString()
);

const insertPost = db.prepare(`
  INSERT OR REPLACE INTO posts (
    id, user_id, content, media_urls, media_type, likes_count, comments_count,
    reposts_count, community_id, tags, is_pinned, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertPost.run(
  'post_01',
  'usr_01',
  'Just finalized the procedural neon city generator in Unreal Engine 5.5! 🌌 Over 1.2M custom instanced meshes running at a steady 90 FPS with full Lumen global illumination. What should I add next: subterranean metro lines or dynamic drone traffic?',
  JSON.stringify(['https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80']),
  'image',
  1428,
  132,
  94,
  'comm_02',
  JSON.stringify(['Cyberpunk', 'UnrealEngine', 'ProceduralArt', 'ReeloCreators']),
  1,
  new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  new Date(Date.now() - 1000 * 60 * 45).toISOString()
);

insertPost.run(
  'post_02',
  'usr_03',
  'Excited to announce REELO Dev Hub! 🚀 We just shipped the first iteration of the unified creator API. Real-time webhooks, instant media encoding, and automatic spatial audio rendering are now live for alpha testers.',
  JSON.stringify([]),
  'none',
  3241,
  285,
  310,
  'comm_01',
  JSON.stringify(['NextGen', 'DevCommunity', 'WebArchitecture', 'REELO']),
  0,
  new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  new Date(Date.now() - 1000 * 60 * 180).toISOString()
);

insertPost.run(
  'post_03',
  'usr_02',
  'Recorded this 32-track modular synthesizer loop under the Tokyo rainy skyline last night. Raw analog oscillators tuned to sub-harmonic frequencies. Headphones recommended 🎧✨',
  JSON.stringify(['https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80']),
  'image',
  890,
  67,
  42,
  'comm_03',
  JSON.stringify(['ModularSynth', 'ElectronicMusic', 'SoundDesign', 'TokyoNights']),
  0,
  new Date(Date.now() - 1000 * 60 * 360).toISOString(),
  new Date(Date.now() - 1000 * 60 * 360).toISOString()
);

insertPost.run(
  'post_04',
  'usr_04',
  'Three consecutive nights at -18°C in the highlands of Iceland rewarded us with this KP7 solar flare storm over the volcanic caldera. Nature will always remain the greatest visual artist.',
  JSON.stringify(['https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200&auto=format&fit=crop&q=80']),
  'image',
  5120,
  418,
  670,
  'comm_04',
  JSON.stringify(['AuroraBorealis', 'Astrophotography', 'Iceland', 'EarthCapture']),
  0,
  new Date(Date.now() - 1000 * 60 * 720).toISOString(),
  new Date(Date.now() - 1000 * 60 * 720).toISOString()
);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('REELO Local PC Database successfully initialized!');
console.log('Database location:', dbPath);
console.log('Tables initialized:', tables.map(t => t.name).join(', '));
const postsCount = db.prepare('SELECT COUNT(*) as count FROM posts').get();
console.log('Total seeded posts in local database:', postsCount.count);

db.close();
