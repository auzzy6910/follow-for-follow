"""Follow-for-Follow backend API."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
from .seed import (
    CREDIT_HISTORY,
    ESCROW_TRANSACTIONS,
    FEATURED_USER,
    GOLDEN_HOUR_SESSIONS,
    LEADERBOARD,
    NICHES,
    PLATFORMS,
    QUESTS,
    TRIBES,
    USER_STATS,
    USERS,
)

app = FastAPI(
    title="Follow-for-Follow API",
    description="Backend API for the Follow-for-Follow social media growth platform",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ───────────────────────────────────────────────────────────────────


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


# ── Niches ───────────────────────────────────────────────────────────────────


@app.get("/api/niches", response_model=list[Niche])
def get_niches() -> list[Niche]:
    return NICHES


# ── Platforms ────────────────────────────────────────────────────────────────


@app.get("/api/platforms", response_model=list[Platform])
def get_platforms() -> list[Platform]:
    return PLATFORMS


# ── Users ────────────────────────────────────────────────────────────────────


@app.get("/api/users", response_model=list[User])
def get_users() -> list[User]:
    return USERS


@app.get("/api/users/featured", response_model=User)
def get_featured_user() -> User:
    return FEATURED_USER


@app.get("/api/users/{user_id}", response_model=User)
def get_user(user_id: str) -> User:
    for user in [FEATURED_USER, *USERS]:
        if user.id == user_id:
            return user
    from fastapi import HTTPException

    raise HTTPException(status_code=404, detail="User not found")


# ── Tribes ───────────────────────────────────────────────────────────────────


@app.get("/api/tribes", response_model=list[Tribe])
def get_tribes() -> list[Tribe]:
    return TRIBES


# ── Quests ───────────────────────────────────────────────────────────────────


@app.get("/api/quests", response_model=list[Quest])
def get_quests() -> list[Quest]:
    return QUESTS


# ── Leaderboard ──────────────────────────────────────────────────────────────


@app.get("/api/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard() -> list[LeaderboardEntry]:
    return LEADERBOARD


# ── Escrow Transactions ─────────────────────────────────────────────────────


@app.get("/api/escrow", response_model=list[EscrowTransaction])
def get_escrow_transactions() -> list[EscrowTransaction]:
    return ESCROW_TRANSACTIONS


# ── Golden Hour Sessions ─────────────────────────────────────────────────────


@app.get("/api/golden-hour", response_model=list[GoldenHourSession])
def get_golden_hour_sessions() -> list[GoldenHourSession]:
    return GOLDEN_HOUR_SESSIONS


# ── Credit History ───────────────────────────────────────────────────────────


@app.get("/api/credits/history", response_model=list[CreditHistoryEntry])
def get_credit_history() -> list[CreditHistoryEntry]:
    return CREDIT_HISTORY


# ── User Stats ───────────────────────────────────────────────────────────────


@app.get("/api/stats", response_model=UserStats)
def get_user_stats() -> UserStats:
    return USER_STATS
