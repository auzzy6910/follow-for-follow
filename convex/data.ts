import { query } from "./_generated/server";

export const getNiches = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("niches").collect();
    return rows.map((row) => ({
      id: row.slug,
      name: row.name,
      icon: row.icon,
      color: row.color,
    }));
  },
});

export const getPlatforms = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("platforms").collect();
    return rows.map((row) => ({
      id: row.slug,
      name: row.name,
      icon: row.icon,
    }));
  },
});

const serializeUser = (row: {
  externalId: string;
  username: string;
  displayName: string;
  avatar: string;
  cover: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  niche: string;
  platform: string;
  tier: string;
  trustScore: number;
  credits: number;
  qualityScore: number;
  isVerified?: boolean;
  lastActive?: string;
}) => ({
  id: row.externalId,
  username: row.username,
  displayName: row.displayName,
  avatar: row.avatar,
  cover: row.cover,
  bio: row.bio,
  followers: row.followers,
  following: row.following,
  posts: row.posts,
  niche: row.niche,
  platform: row.platform,
  tier: row.tier,
  trustScore: row.trustScore,
  credits: row.credits,
  qualityScore: row.qualityScore,
  isVerified: row.isVerified ?? false,
  lastActive: row.lastActive ?? "",
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("isFeatured"), true))
      .collect();
    return rows.map(serializeUser);
  },
});

export const getFeaturedUser = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("users")
      .withIndex("by_featured", (q) => q.eq("isFeatured", true))
      .first();
    if (!row) return null;
    return serializeUser(row);
  },
});

export const getTribes = query({
  args: {},
  handler: async (ctx) => {
    const tribes = await ctx.db.query("tribes").collect();
    const users = await ctx.db
      .query("users")
      .filter((q) => q.neq(q.field("isFeatured"), true))
      .collect();
    return tribes.map((tribe) => {
      const topMembers = users
        .filter((u) => u.niche === tribe.slug)
        .slice(0, 3)
        .map(serializeUser);
      return {
        id: `tribe-${tribe.slug}`,
        name: tribe.name,
        icon: tribe.icon,
        color: tribe.color,
        members: tribe.members,
        activeNow: tribe.activeNow,
        weeklyGrowth: tribe.weeklyGrowth,
        description: tribe.description,
        topMembers,
      };
    });
  },
});

export const getQuests = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("quests").collect();
    return rows.map((row) => ({
      id: row.slug,
      title: row.title,
      reward: row.reward,
      progress: row.progress,
      total: row.total,
      niche: row.niche,
      type: row.type,
    }));
  },
});

export const getLeaderboard = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db
      .query("leaderboard")
      .withIndex("by_rank")
      .collect();
    const users = await ctx.db.query("users").collect();
    const byExternalId = new Map(users.map((u) => [u.externalId, u]));
    return entries
      .map((entry) => {
        const user = byExternalId.get(entry.userExternalId);
        if (!user) return null;
        return {
          ...serializeUser(user),
          rank: entry.rank,
          weeklyFollowers: entry.weeklyFollowers,
          weeklyCredits: entry.weeklyCredits,
          streak: entry.streak,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.weeklyFollowers - a.weeklyFollowers);
  },
});

export const getEscrowTransactions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("escrowTransactions").collect();
    const users = await ctx.db.query("users").collect();
    const byExternalId = new Map(users.map((u) => [u.externalId, u]));
    return rows
      .map((row) => {
        const user = byExternalId.get(row.userExternalId);
        if (!user) return null;
        return {
          id: row.slug,
          user: serializeUser(user),
          credits: row.credits,
          status: row.status,
          daysRemaining: row.daysRemaining,
          followDate: row.followDate,
        };
      })
      .filter((row): row is NonNullable<typeof row> => row !== null);
  },
});

export const getGoldenHourSessions = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("goldenHourSessions").collect();
    return rows.map((row) => ({
      id: row.slug,
      scheduledTime: row.scheduledTime,
      platform: row.platform,
      participants: row.participants,
      status: row.status,
      postUrl: row.postUrl,
    }));
  },
});

export const getCreditHistory = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db.query("creditHistory").collect();
    return rows.map((row) => ({
      id: row.slug,
      type: row.type,
      amount: row.amount,
      action: row.action,
      timestamp: row.timestamp,
    }));
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("userStats")
      .withIndex("by_owner", (q) => q.eq("ownerKey", "demo"))
      .first();
    if (!row) return null;
    return {
      totalCredits: row.totalCredits,
      totalFollowersGained: row.totalFollowersGained,
      totalFollowsGiven: row.totalFollowsGiven,
      trustScore: row.trustScore,
      tier: row.tier,
      streak: row.streak,
      qualityScore: row.qualityScore,
      dailyFollowsRemaining: row.dailyFollowsRemaining,
      dailyFollowLimit: row.dailyFollowLimit,
      cooldownActive: row.cooldownActive,
      nextCooldownReset: row.nextCooldownReset,
      accountAge: row.accountAge,
      unfollowRate: row.unfollowRate,
    };
  },
});
