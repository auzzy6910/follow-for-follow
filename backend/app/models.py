from __future__ import annotations

from pydantic import BaseModel


class Niche(BaseModel):
    id: str
    name: str
    icon: str
    color: str


class Platform(BaseModel):
    id: str
    name: str
    icon: str


class User(BaseModel):
    id: str
    username: str
    displayName: str
    avatar: str
    cover: str
    bio: str
    followers: int
    following: int
    posts: int
    niche: str
    platform: str
    tier: str
    trustScore: int
    credits: int
    qualityScore: int
    isVerified: bool = False
    lastActive: str = ""


class Tribe(BaseModel):
    id: str
    name: str
    icon: str
    color: str
    members: int
    activeNow: int
    weeklyGrowth: str
    description: str
    topMembers: list[User]


class Quest(BaseModel):
    id: str
    title: str
    reward: int
    progress: int
    total: int
    niche: str | None
    type: str


class LeaderboardEntry(BaseModel):
    id: str
    username: str
    displayName: str
    avatar: str
    cover: str
    bio: str
    followers: int
    following: int
    posts: int
    niche: str
    platform: str
    tier: str
    trustScore: int
    credits: int
    qualityScore: int
    isVerified: bool = False
    lastActive: str = ""
    rank: int
    weeklyFollowers: int
    weeklyCredits: int
    streak: int


class EscrowTransaction(BaseModel):
    id: str
    user: User
    credits: int
    status: str
    daysRemaining: int
    followDate: str


class GoldenHourSession(BaseModel):
    id: str
    scheduledTime: str
    platform: str
    participants: int
    status: str
    postUrl: str


class CreditHistoryEntry(BaseModel):
    id: str
    type: str
    amount: int
    action: str
    timestamp: str


class UserStats(BaseModel):
    totalCredits: int
    totalFollowersGained: int
    totalFollowsGiven: int
    trustScore: int
    tier: str
    streak: int
    qualityScore: int
    dailyFollowsRemaining: int
    dailyFollowLimit: int
    cooldownActive: bool
    nextCooldownReset: str | None
    accountAge: int
    unfollowRate: float
