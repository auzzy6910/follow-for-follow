import { query, mutation } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

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

export const getLocations = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("directoryUsers").collect();
    const locationSet = new Set<string>();
    for (const u of users) {
      if (u.location) locationSet.add(u.location);
    }
    return Array.from(locationSet).sort();
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
  location?: string;
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
  location: row.location ?? "",
  trustScore: row.trustScore,
  credits: row.credits,
  qualityScore: row.qualityScore,
  isVerified: row.isVerified ?? false,
  lastActive: row.lastActive ?? "",
});

export const searchUsers = query({
  args: {
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    tier: v.optional(v.string()),
    location: v.optional(v.string()),
    search: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    let q;

    if (args.niche) {
      q = ctx.db
        .query("directoryUsers")
        .withIndex("by_niche", (idx) => idx.eq("niche", args.niche!));
    } else if (args.platform) {
      q = ctx.db
        .query("directoryUsers")
        .withIndex("by_platform", (idx) =>
          idx.eq("platform", args.platform!),
        );
    } else if (args.tier) {
      q = ctx.db
        .query("directoryUsers")
        .withIndex("by_tier", (idx) => idx.eq("tier", args.tier!));
    } else if (args.location) {
      q = ctx.db
        .query("directoryUsers")
        .withIndex("by_location", (idx) =>
          idx.eq("location", args.location!),
        );
    } else {
      q = ctx.db.query("directoryUsers");
    }

    q = q.filter((f) => f.neq(f.field("isFeatured"), true));

    if (args.platform && args.niche) {
      q = q.filter((f) => f.eq(f.field("platform"), args.platform!));
    }
    if (args.tier && (args.niche || args.platform)) {
      q = q.filter((f) => f.eq(f.field("tier"), args.tier!));
    }
    if (args.location && (args.niche || args.platform || args.tier)) {
      q = q.filter((f) => f.eq(f.field("location"), args.location!));
    }

    const result = await q.paginate(args.paginationOpts);

    let pages = result.page.map(serializeUser);

    if (args.search) {
      const lower = args.search.toLowerCase();
      pages = pages.filter(
        (u) =>
          u.displayName.toLowerCase().includes(lower) ||
          u.username.toLowerCase().includes(lower),
      );
    }

    return { ...result, page: pages };
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("directoryUsers")
      .filter((q) => q.neq(q.field("isFeatured"), true))
      .collect();
    return rows.map(serializeUser);
  },
});

export const getFeaturedUser = query({
  args: {},
  handler: async (ctx) => {
    const row = await ctx.db
      .query("directoryUsers")
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
      .query("directoryUsers")
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
    const users = await ctx.db.query("directoryUsers").collect();
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
    const users = await ctx.db.query("directoryUsers").collect();
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

export const getSavedSearches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("savedSearches")
      .withIndex("by_owner", (q) => q.eq("ownerKey", "demo"))
      .collect();
  },
});

export const saveSearch = mutation({
  args: {
    name: v.string(),
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    tier: v.optional(v.string()),
    location: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("savedSearches", {
      ownerKey: "demo",
      name: args.name,
      niche: args.niche,
      platform: args.platform,
      tier: args.tier,
      location: args.location,
      searchQuery: args.searchQuery,
      createdAt: Date.now(),
    });
  },
});

export const deleteSearch = mutation({
  args: { id: v.id("savedSearches") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const getRecommendations = query({
  args: {},
  handler: async (ctx) => {
    const stats = await ctx.db
      .query("userStats")
      .withIndex("by_owner", (q) => q.eq("ownerKey", "demo"))
      .first();
    const myNiche = stats ? stats.tier : null;

    const allUsers = await ctx.db
      .query("directoryUsers")
      .filter((q) => q.neq(q.field("isFeatured"), true))
      .collect();

    if (allUsers.length === 0) return [];

    const sameNicheUsers = myNiche
      ? allUsers.filter((u) => u.tier === myNiche)
      : allUsers;
    const pool = sameNicheUsers.length > 0 ? sameNicheUsers : allUsers;

    const sorted = [...pool].sort((a, b) => b.qualityScore - a.qualityScore);
    return sorted.slice(0, 6).map(serializeUser);
  },
});
