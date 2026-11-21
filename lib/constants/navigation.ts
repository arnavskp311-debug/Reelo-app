export interface NavItemType {
  label: string;
  href: string;
  iconName: 'Home' | 'Compass' | 'Users' | 'MessageSquare' | 'Bell' | 'User' | 'PlusSquare' | 'Sparkles' | 'Bookmark' | 'Settings' | 'BarChart3' | 'Calendar' | 'Radio';
  badge?: number;
}

export const MAIN_NAV_ITEMS: NavItemType[] = [
  { label: 'Home', href: '/home', iconName: 'Home' },
  { label: 'Explore', href: '/explore', iconName: 'Compass' },
  { label: 'Communities', href: '/communities', iconName: 'Users' },
  { label: 'Events', href: '/events', iconName: 'Calendar' },
  { label: 'Creator Studio', href: '/creator', iconName: 'BarChart3' },
  { label: 'Live Stage', href: '/live', iconName: 'Radio' },
  { label: 'Messages', href: '/messages', iconName: 'MessageSquare', badge: 3 },
  { label: 'Notifications', href: '/notifications', iconName: 'Bell', badge: 5 },
  { label: 'Profile', href: '/profile', iconName: 'User' },
];

export const MOBILE_BOTTOM_NAV: NavItemType[] = [
  { label: 'Home', href: '/home', iconName: 'Home' },
  { label: 'Explore', href: '/explore', iconName: 'Compass' },
  { label: 'Create', href: '/create', iconName: 'PlusSquare' },
  { label: 'Communities', href: '/communities', iconName: 'Users' },
  { label: 'Profile', href: '/profile', iconName: 'User' },
];

export const TRENDING_TAGS = [
  { tag: '#ReeloCreators', postsCount: '128.4K', category: 'Culture' },
  { tag: '#WebDevelopment', postsCount: '89.2K', category: 'Technology' },
  { tag: '#AIArtistry', postsCount: '64.1K', category: 'Design' },
  { tag: '#CyberSoundscapes', postsCount: '42.9K', category: 'Music' },
  { tag: '#NextGenGaming', postsCount: '31.5K', category: 'Gaming' },
];
