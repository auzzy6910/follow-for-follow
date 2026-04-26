# Follow for Follow

A social media growth platform that helps users build genuine, engaged audiences through a reciprocal follow system with built-in anti-cheat, quality scoring, and gamification.

## Features

- **Credit & Exchange System** - Earn credits by following others, spend them to get followers. Includes escrow protection and verification engine.
- **Golden Hour Boost** - Schedule posts and join engagement trains to trigger algorithms within the critical 60-90 minute window. Dwell time tasks ensure genuine engagement.
- **AI Quality Score** - AI-powered profile auditing rejects bot-looking accounts and provides contextual comment suggestions.
- **Verification & Anti-Cheat** - 30-day escrow on credits, shadow checks for unfollow rates, and automatic penalties for bad actors.
- **Niche Tribes** - Micro-communities for relevant followers. 2x credit bonus for in-niche follows. Collaboration matching for shout-outs and joint live streams.
- **Gamification** - Tier system (Rookie/Influencer/Legend), daily streaks, quests, and leaderboards.
- **Safety Controls** - Action rate limiting, randomized cooldowns, and account warming to prevent platform bans.
- **Smart Targeting** - Filter by niche, platform, tier, and location for high-value follows.
- **OAuth Integration** - Secure platform connections without password sharing.

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Lucide React icons

### Backend
- Python 3.11+
- FastAPI
- Uvicorn

## Development

### Frontend

```bash
npm install
npm run dev
```

### Backend

```bash
cd backend
pip install fastapi uvicorn
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |
| GET | `/api/niches` | List all niches |
| GET | `/api/platforms` | List all platforms |
| GET | `/api/users` | List all users |
| GET | `/api/users/featured` | Get the featured user |
| GET | `/api/users/{user_id}` | Get a specific user |
| GET | `/api/tribes` | List all tribes with top members |
| GET | `/api/quests` | List all quests |
| GET | `/api/leaderboard` | Get the leaderboard |
| GET | `/api/escrow` | List escrow transactions |
| GET | `/api/golden-hour` | List golden hour sessions |
| GET | `/api/credits/history` | Get credit history |
| GET | `/api/stats` | Get current user stats |

## Build

### Frontend

```bash
npm run build
```

The production build is output to the `dist/` directory.
