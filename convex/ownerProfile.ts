import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop&crop=face";
const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop";

export const getOwnerProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) return null;

    const profile = await ctx.db
      .query("ownerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const account = await ctx.db.get(userId);
    return {
      userId,
      email: account?.email ?? null,
      profile: profile
        ? {
            id: profile._id,
            username: profile.username,
            displayName: profile.displayName,
            bio: profile.bio,
            avatar: profile.avatar,
            cover: profile.cover,
            niche: profile.niche ?? null,
            platform: profile.platform ?? null,
            location: profile.location ?? null,
            followers: profile.followers,
            following: profile.following,
            posts: profile.posts,
            tier: profile.tier,
            trustScore: profile.trustScore,
            qualityScore: profile.qualityScore,
            credits: profile.credits,
            updatedAt: profile.updatedAt,
          }
        : null,
    };
  },
});

export const setOwnerProfile = mutation({
  args: {
    username: v.string(),
    displayName: v.string(),
    bio: v.string(),
    avatar: v.optional(v.string()),
    cover: v.optional(v.string()),
    niche: v.optional(v.string()),
    platform: v.optional(v.string()),
    location: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("You must be signed in to update your profile.");
    }

    const username = args.username.trim().replace(/^@+/, "");
    const displayName = args.displayName.trim();
    const bio = args.bio.trim();
    if (!username) throw new Error("Username is required.");
    if (!displayName) throw new Error("Display name is required.");
    if (!bio) throw new Error("Bio is required.");

    const existing = await ctx.db
      .query("ownerProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const now = Date.now();
    const data = {
      userId,
      username,
      displayName,
      bio,
      avatar: args.avatar?.trim() || existing?.avatar || DEFAULT_AVATAR,
      cover: args.cover?.trim() || existing?.cover || DEFAULT_COVER,
      niche: args.niche?.trim() || existing?.niche,
      platform: args.platform?.trim() || existing?.platform,
      location: args.location?.trim() || existing?.location,
      followers: existing?.followers ?? 0,
      following: existing?.following ?? 0,
      posts: existing?.posts ?? 0,
      tier: existing?.tier ?? "rookie",
      trustScore: existing?.trustScore ?? 100,
      qualityScore: existing?.qualityScore ?? 80,
      credits: existing?.credits ?? 100,
      updatedAt: now,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    }
    return await ctx.db.insert("ownerProfiles", data);
  },
});
