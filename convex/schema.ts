import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  niches: defineTable({
    slug: v.string(),
    name: v.string(),
    icon: v.string(),
    color: v.string(),
  }).index("by_slug", ["slug"]),

  platforms: defineTable({
    slug: v.string(),
    name: v.string(),
    icon: v.string(),
  }).index("by_slug", ["slug"]),

  directoryUsers: defineTable({
    externalId: v.string(),
    username: v.string(),
    displayName: v.string(),
    avatar: v.string(),
    cover: v.string(),
    bio: v.string(),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    niche: v.string(),
    platform: v.string(),
    tier: v.string(),
    location: v.optional(v.string()),
    trustScore: v.number(),
    credits: v.number(),
    qualityScore: v.number(),
    isVerified: v.optional(v.boolean()),
    lastActive: v.optional(v.string()),
    isFeatured: v.optional(v.boolean()),
  })
    .index("by_externalId", ["externalId"])
    .index("by_niche", ["niche"])
    .index("by_platform", ["platform"])
    .index("by_tier", ["tier"])
    .index("by_location", ["location"])
    .index("by_featured", ["isFeatured"]),

  tribes: defineTable({
    slug: v.string(),
    name: v.string(),
    icon: v.string(),
    color: v.string(),
    members: v.number(),
    activeNow: v.number(),
    weeklyGrowth: v.string(),
    description: v.string(),
  }).index("by_slug", ["slug"]),

  quests: defineTable({
    slug: v.string(),
    title: v.string(),
    reward: v.number(),
    progress: v.number(),
    total: v.number(),
    niche: v.union(v.string(), v.null()),
    type: v.string(),
  }).index("by_slug", ["slug"]),

  leaderboard: defineTable({
    userExternalId: v.string(),
    rank: v.number(),
    weeklyFollowers: v.number(),
    weeklyCredits: v.number(),
    streak: v.number(),
  }).index("by_rank", ["rank"]),

  escrowTransactions: defineTable({
    slug: v.string(),
    userExternalId: v.string(),
    credits: v.number(),
    status: v.string(),
    daysRemaining: v.number(),
    followDate: v.string(),
  }).index("by_slug", ["slug"]),

  goldenHourSessions: defineTable({
    slug: v.string(),
    scheduledTime: v.string(),
    platform: v.string(),
    participants: v.number(),
    status: v.string(),
    postUrl: v.string(),
  }).index("by_slug", ["slug"]),

  creditHistory: defineTable({
    slug: v.string(),
    type: v.string(),
    amount: v.number(),
    action: v.string(),
    timestamp: v.string(),
  }).index("by_slug", ["slug"]),

  userStats: defineTable({
    ownerKey: v.string(),
    totalCredits: v.number(),
    totalFollowersGained: v.number(),
    totalFollowsGiven: v.number(),
    trustScore: v.number(),
    tier: v.string(),
    streak: v.number(),
    qualityScore: v.number(),
    dailyFollowsRemaining: v.number(),
    dailyFollowLimit: v.number(),
    cooldownActive: v.boolean(),
    nextCooldownReset: v.union(v.string(), v.null()),
    accountAge: v.number(),
    unfollowRate: v.number(),
  }).index("by_owner", ["ownerKey"]),

  ownerProfiles: defineTable({
    userId: v.id("users"),
    username: v.string(),
    displayName: v.string(),
    bio: v.string(),
    avatar: v.string(),
    cover: v.string(),
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    location: v.optional(v.string()),
    followers: v.number(),
    following: v.number(),
    posts: v.number(),
    tier: v.string(),
    trustScore: v.number(),
    qualityScore: v.number(),
    credits: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  savedSearches: defineTable({
    ownerKey: v.string(),
    name: v.string(),
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    tier: v.optional(v.string()),
    location: v.optional(v.string()),
    searchQuery: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_owner", ["ownerKey"]),
});
