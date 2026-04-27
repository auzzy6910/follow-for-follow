const avatarUrls = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
]

export const TRIBE_FEED = {
  default: [
    { id: 'fp1', displayName: 'Alex Chen', avatar: avatarUrls[0], time: '2h ago', content: 'Just hit 50K followers using the tribe strategy! The 2× bonus really stacks up. Keep grinding everyone 🚀', likes: 47, replies: 12, pinned: true },
    { id: 'fp2', displayName: 'Sarah Strong', avatar: avatarUrls[1], time: '4h ago', content: 'Looking for collab partners for a joint IG live this weekend. Drop a comment if interested!', likes: 23, replies: 8, pinned: false },
    { id: 'fp3', displayName: 'Design Daily', avatar: avatarUrls[2], time: '6h ago', content: 'New engagement train starting at 3 PM EST — make sure your latest post is up before then. Let\'s boost each other!', likes: 35, replies: 15, pinned: false, link: 'https://instagram.com/p/example' },
    { id: 'fp4', displayName: 'Jake Gaming', avatar: avatarUrls[3], time: '8h ago', content: 'Tip: post during golden hour and join the tribe engagement train. My reach went up 340% last week.', likes: 61, replies: 22, pinned: false },
    { id: 'fp5', displayName: 'Melody Rivers', avatar: avatarUrls[4], time: '12h ago', content: 'Welcome to all the new members this week! Remember, in-niche follows earn 2× credits. Quality > quantity.', likes: 89, replies: 31, pinned: false },
  ],
  'tribe-tech': [
    { id: 'tp1', displayName: 'Dev Master', avatar: avatarUrls[0], time: '1h ago', content: 'Shipped a new open-source project today. Would love some eyes on it — link in bio. Happy to follow back all tech creators!', likes: 54, replies: 18, pinned: true },
    { id: 'tp2', displayName: 'Tech Startup', avatar: avatarUrls[2], time: '3h ago', content: 'Our startup just raised a seed round. Documenting the whole journey on Twitter. Join the ride!', likes: 42, replies: 14, pinned: false },
    { id: 'tp3', displayName: 'Code Craft', avatar: avatarUrls[3], time: '5h ago', content: 'Best frameworks for 2026? I\'m seeing a huge shift toward Rust-based tooling. Thoughts?', likes: 38, replies: 27, pinned: false },
    { id: 'tp4', displayName: 'Digital Art', avatar: avatarUrls[4], time: '7h ago', content: 'Built an AI art generator this weekend. The intersection of tech and art is where the magic happens.', likes: 29, replies: 11, pinned: false },
  ],
  'tribe-crypto': [
    { id: 'cp1', displayName: 'Crypto King', avatar: avatarUrls[1], time: '30m ago', content: 'BTC just broke resistance. If you\'re in the crypto tribe, now\'s the time to post your analysis. Engagement trains firing in 1 hour!', likes: 72, replies: 34, pinned: true },
    { id: 'cp2', displayName: 'Crypto X', avatar: avatarUrls[3], time: '2h ago', content: 'DeFi yields are back. Thread incoming on the best protocols for passive income in 2026.', likes: 45, replies: 19, pinned: false },
    { id: 'cp3', displayName: 'Marcus Kimani', avatar: avatarUrls[0], time: '4h ago', content: 'Web3 social is the future. Building community here first, then migrating to decentralized platforms.', likes: 33, replies: 12, pinned: false },
  ],
}

export const TRIBE_CHAT_MESSAGES = {
  default: [
    { id: 'cm1', displayName: 'Alex Chen', avatar: avatarUrls[0], text: 'Hey everyone! New engagement train starting in 30 mins', time: '2:30 PM', isOwn: false },
    { id: 'cm2', displayName: 'Sarah Strong', avatar: avatarUrls[1], text: 'Count me in! Just posted my latest reel', time: '2:31 PM', isOwn: false },
    { id: 'cm3', displayName: 'Design Daily', avatar: avatarUrls[2], text: 'Same here, link is in my bio', time: '2:32 PM', isOwn: false },
    { id: 'cm4', displayName: 'Jake Gaming', avatar: avatarUrls[3], text: 'This tribe is amazing for growth. Got 200 followers this week!', time: '2:35 PM', isOwn: false },
    { id: 'cm5', displayName: 'Melody Rivers', avatar: avatarUrls[4], text: 'Don\'t forget about the 2× bonus for in-niche follows ✨', time: '2:37 PM', isOwn: false },
    { id: 'cm6', displayName: 'Alex Chen', avatar: avatarUrls[0], text: 'Train is live! Go go go 🚂', time: '3:00 PM', isOwn: false },
  ],
  'tribe-tech': [
    { id: 'tcm1', displayName: 'Dev Master', avatar: avatarUrls[0], text: 'Anyone working on AI projects? Looking for collab partners', time: '1:00 PM', isOwn: false },
    { id: 'tcm2', displayName: 'Tech Startup', avatar: avatarUrls[2], text: 'We\'re building an AI SaaS, would love to cross-promote', time: '1:05 PM', isOwn: false },
    { id: 'tcm3', displayName: 'Code Craft', avatar: avatarUrls[3], text: 'Just followed everyone in the tribe. The 2× bonus is 🔥', time: '1:10 PM', isOwn: false },
    { id: 'tcm4', displayName: 'Digital Art', avatar: avatarUrls[4], text: 'Engagement train at 4 PM? Who\'s posting?', time: '1:15 PM', isOwn: false },
  ],
  'tribe-crypto': [
    { id: 'ccm1', displayName: 'Crypto King', avatar: avatarUrls[1], text: 'Market\'s pumping! Get your posts ready', time: '11:00 AM', isOwn: false },
    { id: 'ccm2', displayName: 'Crypto X', avatar: avatarUrls[3], text: 'Posted my BTC analysis thread. Let\'s boost it!', time: '11:15 AM', isOwn: false },
    { id: 'ccm3', displayName: 'Marcus Kimani', avatar: avatarUrls[0], text: 'Followed everyone here. Nairobi crypto community growing fast', time: '11:30 AM', isOwn: false },
  ],
}
