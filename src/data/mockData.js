export const NICHES = [
  { id: 'tech', name: 'Tech & Dev', icon: '💻', color: '#39ff14' },
  { id: 'crypto', name: 'Crypto & Web3', icon: '🪙', color: '#f7931a' },
  { id: 'fitness', name: 'Fitness', icon: '💪', color: '#ff4444' },
  { id: 'art', name: 'Art & Design', icon: '🎨', color: '#9b59b6' },
  { id: 'gaming', name: 'Gaming', icon: '🎮', color: '#3498db' },
  { id: 'music', name: 'Music', icon: '🎵', color: '#e91e63' },
  { id: 'food', name: 'Food & Travel', icon: '🍕', color: '#ff9800' },
  { id: 'business', name: 'Business', icon: '📈', color: '#2ecc71' },
  { id: 'fashion', name: 'Fashion', icon: '👗', color: '#e74c3c' },
  { id: 'education', name: 'Education', icon: '📚', color: '#00bcd4' },
];

export const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: '📸' },
  { id: 'twitter', name: 'X / Twitter', icon: '𝕏' },
  { id: 'tiktok', name: 'TikTok', icon: '🎬' },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼' },
  { id: 'youtube', name: 'YouTube', icon: '▶️' },
  { id: 'threads', name: 'Threads', icon: '🧵' },
];

export const LOCATIONS = [
  'New York, US',
  'Los Angeles, US',
  'London, UK',
  'Tokyo, JP',
  'Nairobi, KE',
  'Lagos, NG',
  'Dubai, AE',
  'Singapore, SG',
  'Berlin, DE',
  'S\u00e3o Paulo, BR',
  'Mumbai, IN',
  'Sydney, AU',
];

const avatarUrls = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face',
];

const coverUrls = [
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
];

export const FEATURED_USER = {
  id: 'featured-1',
  username: 'TechVisionaryAI',
  displayName: 'Alex Chen',
  avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face',
  cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
  bio: 'Building the future of AI. 500K+ community. Join my tribe for exclusive tech insights.',
  followers: 512400,
  following: 1243,
  posts: 2847,
  niche: 'tech',
  platform: 'instagram',
  tier: 'legend',
  location: 'New York, US',
  trustScore: 98,
  credits: 15000,
  qualityScore: 97,
};

export const USERS = Array.from({ length: 24 }, (_, i) => ({
  id: `user-${i + 1}`,
  username: [
    'CryptoKingNairobi', 'FitnessMaverick', 'DesignDailyHQ', 'GameStreamPro',
    'MusicVibesOnly', 'TravelNomad_', 'BizGrowthHack', 'FashionForward',
    'CodeCraft_Dev', 'FoodieExplorer', 'ArtisticSoul', 'TechStartup_',
    'YogaLifeBalance', 'PhotoCapture_', 'StreetStyleKing', 'MotivateDaily',
    'CryptoTrader_X', 'GamerEliteZ', 'ChefCreations', 'FitnessCoachPro',
    'DigitalArtist_', 'VlogMaster_', 'EntrepreneurX', 'StyleInfluencer'
  ][i],
  displayName: [
    'Marcus Kimani', 'Sarah Strong', 'Design Daily', 'Jake Gaming',
    'Melody Rivers', 'Travel Nomad', 'Growth Guru', 'Emma Style',
    'Dev Master', 'Foodie Explorer', 'Luna Art', 'Tech Startup',
    'Yoga Balance', 'Photo Capture', 'Street King', 'Daily Motive',
    'Crypto X', 'Elite Gamer', 'Chef Create', 'Coach Pro',
    'Digital Art', 'Vlog Master', 'Entrepreneur X', 'Style Guru'
  ][i],
  avatar: avatarUrls[i % avatarUrls.length],
  cover: coverUrls[i % coverUrls.length],
  bio: [
    'Crypto enthusiast from Nairobi. Building wealth one block at a time.',
    'Personal trainer & fitness coach. Transform your body, transform your life.',
    'UI/UX designer sharing daily inspiration. 100K+ community.',
    'Full-time streamer & esports competitor. Join the squad!',
    'Singer-songwriter & producer. New album dropping soon.',
    'Exploring the world one country at a time. 80+ countries visited.',
    'Scaling businesses from 0 to 7 figures. Free tips daily.',
    'Fashion blogger & sustainable style advocate.',
    'Full-stack developer. Open source contributor. Coffee addict.',
    'Food critic & recipe creator. Taste the world with me.',
    'Digital artist & illustrator. Commissions open.',
    'Startup founder. Ex-FAANG. Building the next unicorn.',
    'Certified yoga instructor. Mind, body, soul alignment.',
    'Landscape & portrait photographer. Shot on Sony.',
    'Streetwear culture & sneaker reviews.',
    'Your daily dose of motivation and hustle tips.',
    'Trading crypto since 2017. 10X your portfolio.',
    'Pro gamer & content creator. 1M+ followers.',
    'Michelin-trained chef sharing restaurant secrets.',
    'Online fitness coaching. 500+ transformations.',
    'NFT artist & creative director. Pixel perfect.',
    'Daily vlogs & lifestyle content. Living my best life.',
    'Serial entrepreneur. 3 exits. Angel investor.',
    'Fashion & lifestyle influencer. Brand collabs open.'
  ][i],
  followers: Math.floor(Math.random() * 500000) + 1000,
  following: Math.floor(Math.random() * 5000) + 100,
  posts: Math.floor(Math.random() * 3000) + 50,
  niche: NICHES[i % NICHES.length].id,
  platform: PLATFORMS[i % PLATFORMS.length].id,
  tier: ['rookie', 'rookie', 'influencer', 'influencer', 'legend'][Math.floor(Math.random() * 5)],
  location: LOCATIONS[i % LOCATIONS.length],
  trustScore: Math.floor(Math.random() * 30) + 70,
  credits: Math.floor(Math.random() * 5000) + 100,
  qualityScore: Math.floor(Math.random() * 30) + 70,
  isVerified: Math.random() > 0.5,
  lastActive: `${Math.floor(Math.random() * 24)}h ago`,
}));

export const TRIBES = NICHES.map((niche, i) => ({
  id: `tribe-${niche.id}`,
  name: niche.name,
  icon: niche.icon,
  color: niche.color,
  members: Math.floor(Math.random() * 50000) + 5000,
  activeNow: Math.floor(Math.random() * 500) + 50,
  weeklyGrowth: (Math.random() * 15 + 1).toFixed(1),
  topMembers: USERS.filter(u => u.niche === niche.id).slice(0, 3),
  description: [
    'The hub for developers, engineers & tech enthusiasts.',
    'Crypto traders, DeFi builders & blockchain believers.',
    'Fitness coaches, athletes & wellness warriors.',
    'Designers, illustrators & creative minds.',
    'Gamers, streamers & esports competitors.',
    'Musicians, producers & music lovers.',
    'Foodies, travelers & adventure seekers.',
    'Entrepreneurs, marketers & business builders.',
    'Fashion bloggers, stylists & trendsetters.',
    'Teachers, learners & knowledge sharers.',
  ][i],
}));

export const LEADERBOARD = USERS.slice(0, 10).map((user, i) => ({
  ...user,
  rank: i + 1,
  weeklyFollowers: Math.floor(Math.random() * 10000) + 500,
  weeklyCredits: Math.floor(Math.random() * 3000) + 200,
  streak: Math.floor(Math.random() * 30) + 1,
})).sort((a, b) => b.weeklyFollowers - a.weeklyFollowers);

function buildLeaderboard(users, followerRange, creditRange) {
  return users.map((user, i) => ({
    ...user,
    rank: i + 1,
    weeklyFollowers: Math.floor(Math.random() * followerRange[1]) + followerRange[0],
    weeklyCredits: Math.floor(Math.random() * creditRange[1]) + creditRange[0],
    streak: Math.floor(Math.random() * 30) + 1,
  })).sort((a, b) => b.weeklyFollowers - a.weeklyFollowers);
}

export const LEADERBOARD_DAILY = buildLeaderboard(USERS.slice(0, 10), [100, 2000], [50, 500]);
export const LEADERBOARD_WEEKLY = LEADERBOARD;
export const LEADERBOARD_ALLTIME = buildLeaderboard(
  [...USERS].sort(() => Math.random() - 0.5).slice(0, 10),
  [50000, 200000],
  [10000, 50000],
);

export const COMMENT_TEMPLATES = [
  {
    id: 'ct1',
    category: 'fitness',
    postContext: 'For a fitness transformation post:',
    text: 'Incredible progress! The dedication to consistency really shows. What was the biggest mindset shift for you?',
    status: 'pending',
  },
  {
    id: 'ct2',
    category: 'tech',
    postContext: 'For a coding tutorial:',
    text: 'Clean implementation! The way you broke down the recursion makes it so much easier to follow. Bookmarked.',
    status: 'pending',
  },
  {
    id: 'ct3',
    category: 'food',
    postContext: 'For a recipe reel:',
    text: 'That caramelization is perfect. Do you use a cast iron or stainless for this?',
    status: 'pending',
  },
  {
    id: 'ct4',
    category: 'travel',
    postContext: 'For a travel photography post:',
    text: 'The golden hour lighting here is stunning. How early did you have to get up for this shot?',
    status: 'pending',
  },
  {
    id: 'ct5',
    category: 'business',
    postContext: 'For a startup milestone post:',
    text: 'Congrats on the milestone! The pivot strategy you described is textbook — would love to hear about the metrics that drove that decision.',
    status: 'pending',
  },
];

export const QUESTS = [
  { id: 'q1', title: 'Follow 5 users in Tech tribe', reward: 50, progress: 3, total: 5, niche: 'tech', type: 'daily' },
  { id: 'q2', title: 'Engage with 3 posts (15s+ dwell)', reward: 30, progress: 1, total: 3, niche: null, type: 'daily' },
  { id: 'q3', title: 'Complete your profile audit', reward: 100, progress: 0, total: 1, niche: null, type: 'onetime' },
  { id: 'q4', title: 'Join 2 new tribes', reward: 75, progress: 1, total: 2, niche: null, type: 'weekly' },
  { id: 'q5', title: 'Maintain 7-day streak', reward: 200, progress: 5, total: 7, niche: null, type: 'weekly' },
  { id: 'q6', title: 'Follow 10 users in your niche', reward: 100, progress: 6, total: 10, niche: null, type: 'daily' },
];

export const ESCROW_TRANSACTIONS = [
  { id: 'e1', user: USERS[0], credits: 500, status: 'held', daysRemaining: 25, followDate: '2026-04-01' },
  { id: 'e2', user: USERS[1], credits: 300, status: 'released', daysRemaining: 0, followDate: '2026-03-10' },
  { id: 'e3', user: USERS[2], credits: 200, status: 'slashed', daysRemaining: 0, followDate: '2026-03-05' },
  { id: 'e4', user: USERS[3], credits: 450, status: 'held', daysRemaining: 18, followDate: '2026-04-07' },
  { id: 'e5', user: USERS[4], credits: 150, status: 'released', daysRemaining: 0, followDate: '2026-03-01' },
];

export const GOLDEN_HOUR_SESSIONS = [
  { id: 'gh1', scheduledTime: '2026-04-26T10:00:00Z', platform: 'instagram', participants: 47, status: 'upcoming', postUrl: '' },
  { id: 'gh2', scheduledTime: '2026-04-26T14:00:00Z', platform: 'twitter', participants: 32, status: 'upcoming', postUrl: '' },
  { id: 'gh3', scheduledTime: '2026-04-25T09:00:00Z', platform: 'linkedin', participants: 28, status: 'completed', postUrl: '' },
];

export const CREDIT_HISTORY = [
  { id: 'ch1', type: 'earned', amount: 50, action: 'Followed CryptoKingNairobi', timestamp: '2 hours ago' },
  { id: 'ch2', type: 'earned', amount: 100, action: 'Completed daily quest', timestamp: '3 hours ago' },
  { id: 'ch3', type: 'spent', amount: 200, action: 'Listed profile for followers', timestamp: '5 hours ago' },
  { id: 'ch4', type: 'earned', amount: 75, action: 'Tribe bonus (2x)', timestamp: '1 day ago' },
  { id: 'ch5', type: 'slashed', amount: 150, action: 'Unfollowed within 30 days', timestamp: '2 days ago' },
  { id: 'ch6', type: 'earned', amount: 200, action: '7-day streak bonus', timestamp: '3 days ago' },
];

export const USER_STATS = {
  totalCredits: 2450,
  totalFollowersGained: 1247,
  totalFollowsGiven: 1580,
  trustScore: 92,
  tier: 'influencer',
  streak: 12,
  qualityScore: 88,
  dailyFollowsRemaining: 35,
  dailyFollowLimit: 50,
  cooldownActive: false,
  cooldownUntil: null,
  nextCooldownReset: null,
  accountAge: 45,
  unfollowRate: 3.2,
};

export const PENALTIES = [
  {
    id: 'p1',
    severity: 'warning',
    title: 'Unfollow rate spike detected',
    reason:
      'Your unfollow rate climbed to 8.4% over the last 48h — above the 5% safe threshold. A first-offense warning has been issued.',
    creditsSlashed: 150,
    issuedAt: '2026-04-24T09:15:00Z',
    expiresAt: '2026-05-24T09:15:00Z',
    status: 'active',
    appealText: null,
    appealedAt: null,
  },
  {
    id: 'p2',
    severity: 'notice',
    title: 'Shadow-check flagged cluster follow',
    reason:
      'Automated shadow-check flagged 12 follows performed within 47 seconds. No penalty applied, but future clusters will trigger a cooldown.',
    creditsSlashed: 0,
    issuedAt: '2026-04-18T14:02:00Z',
    expiresAt: null,
    status: 'active',
    appealText: null,
    appealedAt: null,
  },
  {
    id: 'p3',
    severity: 'warning',
    title: 'Low-quality comment template',
    reason:
      'One of your AI comment suggestions was flagged by 3 reviewers as generic. The template has been paused.',
    creditsSlashed: 25,
    issuedAt: '2026-04-10T21:44:00Z',
    expiresAt: null,
    status: 'overturned',
    appealText: 'The comment was tailored to the post context — reviewers missed the reference.',
    appealedAt: '2026-04-11T08:00:00Z',
  },
];

export const INBOX_NOTIFICATIONS = [
  {
    id: 'n1',
    type: 'follow_back',
    title: '@TechVisionaryAI followed you back',
    body: 'Credit escrow released — +97 credits added to your balance.',
    createdAt: Date.now() - 1000 * 60 * 4,
    read: false,
    link: '/credits',
  },
  {
    id: 'n2',
    type: 'escrow',
    title: 'Escrow released for @FitnessMaverick',
    body: '300 credits unlocked after 30-day verification window.',
    createdAt: Date.now() - 1000 * 60 * 42,
    read: false,
    link: '/wallet',
  },
  {
    id: 'n3',
    type: 'quest',
    title: 'Daily quest completed',
    body: "You finished 'Follow 5 users in Tech tribe' — claim +50 cr.",
    createdAt: Date.now() - 1000 * 60 * 60 * 2,
    read: false,
    link: '/gamification',
  },
  {
    id: 'n4',
    type: 'penalty',
    title: 'Warning issued: unfollow rate spike',
    body: '150 credits slashed. Tap to review the warning and file an appeal.',
    createdAt: Date.now() - 1000 * 60 * 60 * 5,
    read: true,
    link: '/safety',
  },
  {
    id: 'n5',
    type: 'follow_back',
    title: '@DesignDailyHQ followed you back',
    body: '+75 credits (2× tribe bonus applied).',
    createdAt: Date.now() - 1000 * 60 * 60 * 8,
    read: true,
    link: '/credits',
  },
];
