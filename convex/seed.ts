import { mutation } from "./_generated/server";

const NICHES = [
  { slug: "tech", name: "Tech & Dev", icon: "💻", color: "#39ff14" },
  { slug: "crypto", name: "Crypto & Web3", icon: "🪙", color: "#f7931a" },
  { slug: "fitness", name: "Fitness", icon: "💪", color: "#ff4444" },
  { slug: "art", name: "Art & Design", icon: "🎨", color: "#9b59b6" },
  { slug: "gaming", name: "Gaming", icon: "🎮", color: "#3498db" },
  { slug: "music", name: "Music", icon: "🎵", color: "#e91e63" },
  { slug: "food", name: "Food & Travel", icon: "🍕", color: "#ff9800" },
  { slug: "business", name: "Business", icon: "📈", color: "#2ecc71" },
  { slug: "fashion", name: "Fashion", icon: "👗", color: "#e74c3c" },
  { slug: "education", name: "Education", icon: "📚", color: "#00bcd4" },
];

const PLATFORMS = [
  { slug: "instagram", name: "Instagram", icon: "📸" },
  { slug: "twitter", name: "X / Twitter", icon: "𝕏" },
  { slug: "tiktok", name: "TikTok", icon: "🎬" },
  { slug: "linkedin", name: "LinkedIn", icon: "💼" },
  { slug: "youtube", name: "YouTube", icon: "▶️" },
  { slug: "threads", name: "Threads", icon: "🧵" },
];

const avatarUrls = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face",
];

const coverUrls = [
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
];

const USER_NAMES = [
  "CryptoKingNairobi",
  "FitnessMaverick",
  "DesignDailyHQ",
  "GameStreamPro",
  "MusicVibesOnly",
  "TravelNomad_",
  "BizGrowthHack",
  "FashionForward",
  "CodeCraft_Dev",
  "FoodieExplorer",
  "ArtisticSoul",
  "TechStartup_",
  "YogaLifeBalance",
  "PhotoCapture_",
  "StreetStyleKing",
  "MotivateDaily",
  "CryptoTrader_X",
  "GamerEliteZ",
  "ChefCreations",
  "FitnessCoachPro",
  "DigitalArtist_",
  "VlogMaster_",
  "EntrepreneurX",
  "StyleInfluencer",
];

const DISPLAY_NAMES = [
  "Marcus Kimani",
  "Sarah Strong",
  "Design Daily",
  "Jake Gaming",
  "Melody Rivers",
  "Travel Nomad",
  "Growth Guru",
  "Emma Style",
  "Dev Master",
  "Foodie Explorer",
  "Luna Art",
  "Tech Startup",
  "Yoga Balance",
  "Photo Capture",
  "Street King",
  "Daily Motive",
  "Crypto X",
  "Elite Gamer",
  "Chef Create",
  "Coach Pro",
  "Digital Art",
  "Vlog Master",
  "Entrepreneur X",
  "Style Guru",
];

const BIOS = [
  "Crypto enthusiast from Nairobi. Building wealth one block at a time.",
  "Personal trainer & fitness coach. Transform your body, transform your life.",
  "UI/UX designer sharing daily inspiration. 100K+ community.",
  "Full-time streamer & esports competitor. Join the squad!",
  "Singer-songwriter & producer. New album dropping soon.",
  "Exploring the world one country at a time. 80+ countries visited.",
  "Scaling businesses from 0 to 7 figures. Free tips daily.",
  "Fashion blogger & sustainable style advocate.",
  "Full-stack developer. Open source contributor. Coffee addict.",
  "Food critic & recipe creator. Taste the world with me.",
  "Digital artist & illustrator. Commissions open.",
  "Startup founder. Ex-FAANG. Building the next unicorn.",
  "Certified yoga instructor. Mind, body, soul alignment.",
  "Landscape & portrait photographer. Shot on Sony.",
  "Streetwear culture & sneaker reviews.",
  "Your daily dose of motivation and hustle tips.",
  "Trading crypto since 2017. 10X your portfolio.",
  "Pro gamer & content creator. 1M+ followers.",
  "Michelin-trained chef sharing restaurant secrets.",
  "Online fitness coaching. 500+ transformations.",
  "NFT artist & creative director. Pixel perfect.",
  "Daily vlogs & lifestyle content. Living my best life.",
  "Serial entrepreneur. 3 exits. Angel investor.",
  "Fashion & lifestyle influencer. Brand collabs open.",
];

const TIERS = ["rookie", "rookie", "influencer", "influencer", "legend"];

const LOCATIONS = [
  "New York, US",
  "Los Angeles, US",
  "London, UK",
  "Tokyo, JP",
  "Nairobi, KE",
  "Lagos, NG",
  "Dubai, AE",
  "Singapore, SG",
  "Berlin, DE",
  "São Paulo, BR",
  "Mumbai, IN",
  "Sydney, AU",
];

const TRIBE_DESCRIPTIONS = [
  "The hub for developers, engineers & tech enthusiasts.",
  "Crypto traders, DeFi builders & blockchain believers.",
  "Fitness coaches, athletes & wellness warriors.",
  "Designers, illustrators & creative minds.",
  "Gamers, streamers & esports competitors.",
  "Musicians, producers & music lovers.",
  "Foodies, travelers & adventure seekers.",
  "Entrepreneurs, marketers & business builders.",
  "Fashion bloggers, stylists & trendsetters.",
  "Teachers, learners & knowledge sharers.",
];

const QUESTS = [
  {
    slug: "q1",
    title: "Follow 5 users in Tech tribe",
    reward: 50,
    progress: 3,
    total: 5,
    niche: "tech",
    type: "daily",
  },
  {
    slug: "q2",
    title: "Engage with 3 posts (15s+ dwell)",
    reward: 30,
    progress: 1,
    total: 3,
    niche: null,
    type: "daily",
  },
  {
    slug: "q3",
    title: "Complete your profile audit",
    reward: 100,
    progress: 0,
    total: 1,
    niche: null,
    type: "onetime",
  },
  {
    slug: "q4",
    title: "Join 2 new tribes",
    reward: 75,
    progress: 1,
    total: 2,
    niche: null,
    type: "weekly",
  },
  {
    slug: "q5",
    title: "Maintain 7-day streak",
    reward: 200,
    progress: 5,
    total: 7,
    niche: null,
    type: "weekly",
  },
  {
    slug: "q6",
    title: "Follow 10 users in your niche",
    reward: 100,
    progress: 6,
    total: 10,
    niche: null,
    type: "daily",
  },
];

const GOLDEN_HOUR_SESSIONS = [
  {
    slug: "gh1",
    scheduledTime: "2026-04-26T10:00:00Z",
    platform: "instagram",
    participants: 47,
    status: "upcoming",
    postUrl: "",
  },
  {
    slug: "gh2",
    scheduledTime: "2026-04-26T14:00:00Z",
    platform: "twitter",
    participants: 32,
    status: "upcoming",
    postUrl: "",
  },
  {
    slug: "gh3",
    scheduledTime: "2026-04-25T09:00:00Z",
    platform: "linkedin",
    participants: 28,
    status: "completed",
    postUrl: "",
  },
];

const CREDIT_HISTORY = [
  { slug: "ch1", type: "earned", amount: 50, action: "Followed CryptoKingNairobi", timestamp: "2 hours ago" },
  { slug: "ch2", type: "earned", amount: 100, action: "Completed daily quest", timestamp: "3 hours ago" },
  { slug: "ch3", type: "spent", amount: 200, action: "Listed profile for followers", timestamp: "5 hours ago" },
  { slug: "ch4", type: "earned", amount: 75, action: "Tribe bonus (2x)", timestamp: "1 day ago" },
  { slug: "ch5", type: "slashed", amount: 150, action: "Unfollowed within 30 days", timestamp: "2 days ago" },
  { slug: "ch6", type: "earned", amount: 200, action: "7-day streak bonus", timestamp: "3 days ago" },
];

// Deterministic pseudo-random number generator (mulberry32)
function mulberry32(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    // Clear existing rows so seed is idempotent.
    const tables = [
      "niches",
      "platforms",
      "directoryUsers",
      "tribes",
      "quests",
      "leaderboard",
      "escrowTransactions",
      "goldenHourSessions",
      "creditHistory",
      "userStats",
      "savedSearches",
    ] as const;
    for (const table of tables) {
      const rows = await ctx.db.query(table).collect();
      for (const row of rows) {
        await ctx.db.delete(row._id);
      }
    }

    for (const niche of NICHES) {
      await ctx.db.insert("niches", niche);
    }
    for (const platform of PLATFORMS) {
      await ctx.db.insert("platforms", platform);
    }

    // Featured user
    await ctx.db.insert("directoryUsers", {
      externalId: "featured-1",
      username: "TechVisionaryAI",
      displayName: "Alex Chen",
      avatar:
        "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
      cover:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
      bio:
        "Building the future of AI. 500K+ community. Join my tribe for exclusive tech insights.",
      followers: 512400,
      following: 1243,
      posts: 2847,
      niche: "tech",
      platform: "instagram",
      tier: "legend",
      location: "New York, US",
      trustScore: 98,
      credits: 15000,
      qualityScore: 97,
      isFeatured: true,
    });

    const rng = mulberry32(42);
    for (let i = 0; i < 24; i++) {
      const tier = TIERS[Math.floor(rng() * TIERS.length)];
      await ctx.db.insert("directoryUsers", {
        externalId: `user-${i + 1}`,
        username: USER_NAMES[i],
        displayName: DISPLAY_NAMES[i],
        avatar: avatarUrls[i % avatarUrls.length],
        cover: coverUrls[i % coverUrls.length],
        bio: BIOS[i],
        followers: Math.floor(rng() * 500000) + 1000,
        following: Math.floor(rng() * 5000) + 100,
        posts: Math.floor(rng() * 3000) + 50,
        niche: NICHES[i % NICHES.length].slug,
        platform: PLATFORMS[i % PLATFORMS.length].slug,
        tier,
        location: LOCATIONS[i % LOCATIONS.length],
        trustScore: Math.floor(rng() * 30) + 70,
        credits: Math.floor(rng() * 5000) + 100,
        qualityScore: Math.floor(rng() * 30) + 70,
        isVerified: rng() > 0.5,
        lastActive: `${Math.floor(rng() * 24)}h ago`,
        isFeatured: false,
      });
    }

    for (let i = 0; i < NICHES.length; i++) {
      const niche = NICHES[i];
      await ctx.db.insert("tribes", {
        slug: niche.slug,
        name: niche.name,
        icon: niche.icon,
        color: niche.color,
        members: Math.floor(rng() * 50000) + 5000,
        activeNow: Math.floor(rng() * 500) + 50,
        weeklyGrowth: (rng() * 15 + 1).toFixed(1),
        description: TRIBE_DESCRIPTIONS[i],
      });
    }

    for (const quest of QUESTS) {
      await ctx.db.insert("quests", quest);
    }

    for (let i = 0; i < 10; i++) {
      await ctx.db.insert("leaderboard", {
        userExternalId: `user-${i + 1}`,
        rank: i + 1,
        weeklyFollowers: Math.floor(rng() * 10000) + 500,
        weeklyCredits: Math.floor(rng() * 3000) + 200,
        streak: Math.floor(rng() * 30) + 1,
      });
    }

    const escrows = [
      { slug: "e1", userExternalId: "user-1", credits: 500, status: "held", daysRemaining: 25, followDate: "2026-04-01" },
      { slug: "e2", userExternalId: "user-2", credits: 300, status: "released", daysRemaining: 0, followDate: "2026-03-10" },
      { slug: "e3", userExternalId: "user-3", credits: 200, status: "slashed", daysRemaining: 0, followDate: "2026-03-05" },
      { slug: "e4", userExternalId: "user-4", credits: 450, status: "held", daysRemaining: 18, followDate: "2026-04-07" },
      { slug: "e5", userExternalId: "user-5", credits: 150, status: "released", daysRemaining: 0, followDate: "2026-03-01" },
    ];
    for (const escrow of escrows) {
      await ctx.db.insert("escrowTransactions", escrow);
    }

    for (const session of GOLDEN_HOUR_SESSIONS) {
      await ctx.db.insert("goldenHourSessions", session);
    }

    for (const row of CREDIT_HISTORY) {
      await ctx.db.insert("creditHistory", row);
    }

    await ctx.db.insert("userStats", {
      ownerKey: "demo",
      totalCredits: 2450,
      totalFollowersGained: 1247,
      totalFollowsGiven: 1580,
      trustScore: 92,
      tier: "influencer",
      streak: 12,
      qualityScore: 88,
      dailyFollowsRemaining: 35,
      dailyFollowLimit: 50,
      cooldownActive: false,
      nextCooldownReset: null,
      accountAge: 45,
      unfollowRate: 3.2,
    });

    return { ok: true };
  },
});
