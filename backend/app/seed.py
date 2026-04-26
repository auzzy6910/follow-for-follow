"""Deterministic seed data matching the frontend mock data / Convex seed."""

from __future__ import annotations

from .models import (
    CreditHistoryEntry,
    EscrowTransaction,
    GoldenHourSession,
    LeaderboardEntry,
    Niche,
    Platform,
    Quest,
    Tribe,
    User,
    UserStats,
)

# ── Reference lists ──────────────────────────────────────────────────────────

NICHES: list[Niche] = [
    Niche(id="tech", name="Tech & Dev", icon="\U0001f4bb", color="#39ff14"),
    Niche(id="crypto", name="Crypto & Web3", icon="\U0001fa99", color="#f7931a"),
    Niche(id="fitness", name="Fitness", icon="\U0001f4aa", color="#ff4444"),
    Niche(id="art", name="Art & Design", icon="\U0001f3a8", color="#9b59b6"),
    Niche(id="gaming", name="Gaming", icon="\U0001f3ae", color="#3498db"),
    Niche(id="music", name="Music", icon="\U0001f3b5", color="#e91e63"),
    Niche(id="food", name="Food & Travel", icon="\U0001f355", color="#ff9800"),
    Niche(id="business", name="Business", icon="\U0001f4c8", color="#2ecc71"),
    Niche(id="fashion", name="Fashion", icon="\U0001f457", color="#e74c3c"),
    Niche(id="education", name="Education", icon="\U0001f4da", color="#00bcd4"),
]

PLATFORMS: list[Platform] = [
    Platform(id="instagram", name="Instagram", icon="\U0001f4f8"),
    Platform(id="twitter", name="X / Twitter", icon="\U0001d54f"),
    Platform(id="tiktok", name="TikTok", icon="\U0001f3ac"),
    Platform(id="linkedin", name="LinkedIn", icon="\U0001f4bc"),
    Platform(id="youtube", name="YouTube", icon="\u25b6\ufe0f"),
    Platform(id="threads", name="Threads", icon="\U0001f9f5"),
]

# ── Deterministic PRNG (mulberry32, matches the Convex seed) ─────────────────

def _mulberry32(seed: int):
    t = seed
    def _next() -> float:
        nonlocal t
        t = (t + 0x6D2B79F5) & 0xFFFFFFFF
        r = ((t ^ (t >> 15)) * (1 | t)) & 0xFFFFFFFF
        r = ((r + ((r ^ (r >> 7)) * (61 | r)) & 0xFFFFFFFF) ^ r) & 0xFFFFFFFF
        return ((r ^ (r >> 14)) & 0xFFFFFFFF) / 4294967296
    return _next

_rng = _mulberry32(42)

_AVATAR_URLS = [
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
]

_COVER_URLS = [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
]

_USERNAMES = [
    "CryptoKingNairobi", "FitnessMaverick", "DesignDailyHQ", "GameStreamPro",
    "MusicVibesOnly", "TravelNomad_", "BizGrowthHack", "FashionForward",
    "CodeCraft_Dev", "FoodieExplorer", "ArtisticSoul", "TechStartup_",
    "YogaLifeBalance", "PhotoCapture_", "StreetStyleKing", "MotivateDaily",
    "CryptoTrader_X", "GamerEliteZ", "ChefCreations", "FitnessCoachPro",
    "DigitalArtist_", "VlogMaster_", "EntrepreneurX", "StyleInfluencer",
]

_DISPLAY_NAMES = [
    "Marcus Kimani", "Sarah Strong", "Design Daily", "Jake Gaming",
    "Melody Rivers", "Travel Nomad", "Growth Guru", "Emma Style",
    "Dev Master", "Foodie Explorer", "Luna Art", "Tech Startup",
    "Yoga Balance", "Photo Capture", "Street King", "Daily Motive",
    "Crypto X", "Elite Gamer", "Chef Create", "Coach Pro",
    "Digital Art", "Vlog Master", "Entrepreneur X", "Style Guru",
]

_BIOS = [
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
]

_TIERS = ["rookie", "rookie", "influencer", "influencer", "legend"]

_TRIBE_DESCRIPTIONS = [
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
]

# ── Featured user ────────────────────────────────────────────────────────────

FEATURED_USER = User(
    id="featured-1",
    username="TechVisionaryAI",
    displayName="Alex Chen",
    avatar="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&h=400&fit=crop&crop=face",
    cover="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop",
    bio="Building the future of AI. 500K+ community. Join my tribe for exclusive tech insights.",
    followers=512400,
    following=1243,
    posts=2847,
    niche="tech",
    platform="instagram",
    tier="legend",
    trustScore=98,
    credits=15000,
    qualityScore=97,
)

# ── Generate 24 users ────────────────────────────────────────────────────────

def _build_users() -> list[User]:
    rng = _mulberry32(42)
    users: list[User] = []
    for i in range(24):
        tier = _TIERS[int(rng() * len(_TIERS))]
        users.append(
            User(
                id=f"user-{i + 1}",
                username=_USERNAMES[i],
                displayName=_DISPLAY_NAMES[i],
                avatar=_AVATAR_URLS[i % len(_AVATAR_URLS)],
                cover=_COVER_URLS[i % len(_COVER_URLS)],
                bio=_BIOS[i],
                followers=int(rng() * 500000) + 1000,
                following=int(rng() * 5000) + 100,
                posts=int(rng() * 3000) + 50,
                niche=NICHES[i % len(NICHES)].id,
                platform=PLATFORMS[i % len(PLATFORMS)].id,
                tier=tier,
                trustScore=int(rng() * 30) + 70,
                credits=int(rng() * 5000) + 100,
                qualityScore=int(rng() * 30) + 70,
                isVerified=rng() > 0.5,
                lastActive=f"{int(rng() * 24)}h ago",
            )
        )
    return users


USERS: list[User] = _build_users()
_USERS_BY_ID: dict[str, User] = {u.id: u for u in USERS}

# ── Tribes ───────────────────────────────────────────────────────────────────

def _build_tribes() -> list[Tribe]:
    rng = _mulberry32(99)
    tribes: list[Tribe] = []
    for i, niche in enumerate(NICHES):
        top = [u for u in USERS if u.niche == niche.id][:3]
        tribes.append(
            Tribe(
                id=f"tribe-{niche.id}",
                name=niche.name,
                icon=niche.icon,
                color=niche.color,
                members=int(rng() * 50000) + 5000,
                activeNow=int(rng() * 500) + 50,
                weeklyGrowth=f"{rng() * 15 + 1:.1f}",
                description=_TRIBE_DESCRIPTIONS[i],
                topMembers=top,
            )
        )
    return tribes


TRIBES: list[Tribe] = _build_tribes()

# ── Quests ───────────────────────────────────────────────────────────────────

QUESTS: list[Quest] = [
    Quest(id="q1", title="Follow 5 users in Tech tribe", reward=50, progress=3, total=5, niche="tech", type="daily"),
    Quest(id="q2", title="Engage with 3 posts (15s+ dwell)", reward=30, progress=1, total=3, niche=None, type="daily"),
    Quest(id="q3", title="Complete your profile audit", reward=100, progress=0, total=1, niche=None, type="onetime"),
    Quest(id="q4", title="Join 2 new tribes", reward=75, progress=1, total=2, niche=None, type="weekly"),
    Quest(id="q5", title="Maintain 7-day streak", reward=200, progress=5, total=7, niche=None, type="weekly"),
    Quest(id="q6", title="Follow 10 users in your niche", reward=100, progress=6, total=10, niche=None, type="daily"),
]

# ── Leaderboard ──────────────────────────────────────────────────────────────

def _build_leaderboard() -> list[LeaderboardEntry]:
    rng = _mulberry32(77)
    entries: list[LeaderboardEntry] = []
    for i in range(10):
        u = USERS[i]
        entries.append(
            LeaderboardEntry(
                **u.model_dump(),
                rank=i + 1,
                weeklyFollowers=int(rng() * 10000) + 500,
                weeklyCredits=int(rng() * 3000) + 200,
                streak=int(rng() * 30) + 1,
            )
        )
    entries.sort(key=lambda e: e.weeklyFollowers, reverse=True)
    return entries


LEADERBOARD: list[LeaderboardEntry] = _build_leaderboard()

# ── Escrow Transactions ─────────────────────────────────────────────────────

ESCROW_TRANSACTIONS: list[EscrowTransaction] = [
    EscrowTransaction(id="e1", user=USERS[0], credits=500, status="held", daysRemaining=25, followDate="2026-04-01"),
    EscrowTransaction(id="e2", user=USERS[1], credits=300, status="released", daysRemaining=0, followDate="2026-03-10"),
    EscrowTransaction(id="e3", user=USERS[2], credits=200, status="slashed", daysRemaining=0, followDate="2026-03-05"),
    EscrowTransaction(id="e4", user=USERS[3], credits=450, status="held", daysRemaining=18, followDate="2026-04-07"),
    EscrowTransaction(id="e5", user=USERS[4], credits=150, status="released", daysRemaining=0, followDate="2026-03-01"),
]

# ── Golden Hour Sessions ─────────────────────────────────────────────────────

GOLDEN_HOUR_SESSIONS: list[GoldenHourSession] = [
    GoldenHourSession(id="gh1", scheduledTime="2026-04-26T10:00:00Z", platform="instagram", participants=47, status="upcoming", postUrl=""),
    GoldenHourSession(id="gh2", scheduledTime="2026-04-26T14:00:00Z", platform="twitter", participants=32, status="upcoming", postUrl=""),
    GoldenHourSession(id="gh3", scheduledTime="2026-04-25T09:00:00Z", platform="linkedin", participants=28, status="completed", postUrl=""),
]

# ── Credit History ───────────────────────────────────────────────────────────

CREDIT_HISTORY: list[CreditHistoryEntry] = [
    CreditHistoryEntry(id="ch1", type="earned", amount=50, action="Followed CryptoKingNairobi", timestamp="2 hours ago"),
    CreditHistoryEntry(id="ch2", type="earned", amount=100, action="Completed daily quest", timestamp="3 hours ago"),
    CreditHistoryEntry(id="ch3", type="spent", amount=200, action="Listed profile for followers", timestamp="5 hours ago"),
    CreditHistoryEntry(id="ch4", type="earned", amount=75, action="Tribe bonus (2x)", timestamp="1 day ago"),
    CreditHistoryEntry(id="ch5", type="slashed", amount=150, action="Unfollowed within 30 days", timestamp="2 days ago"),
    CreditHistoryEntry(id="ch6", type="earned", amount=200, action="7-day streak bonus", timestamp="3 days ago"),
]

# ── User Stats ───────────────────────────────────────────────────────────────

USER_STATS = UserStats(
    totalCredits=2450,
    totalFollowersGained=1247,
    totalFollowsGiven=1580,
    trustScore=92,
    tier="influencer",
    streak=12,
    qualityScore=88,
    dailyFollowsRemaining=35,
    dailyFollowLimit=50,
    cooldownActive=False,
    nextCooldownReset=None,
    accountAge=45,
    unfollowRate=3.2,
)
