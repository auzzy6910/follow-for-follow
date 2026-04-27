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

- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Lucide React icons
- [Convex](https://www.convex.dev) backend (`convex/` directory)

## Development

```bash
npm install
cp .env.example .env.local   # then set VITE_CONVEX_URL to your Convex deployment URL
npm run dev
```

The frontend reads `VITE_CONVEX_URL` from `.env.local` and connects to the
Convex backend defined in `convex/`. If the variable is not set the app falls
back to the bundled mock data in `src/data/mockData.js` so the UI still
renders.

## Backend (Convex)

Schema, queries and the seed mutation live under `convex/`. To work against a
live deployment:

```bash
# Push functions + schema to your Convex deployment
npx convex deploy

# Populate the deployment with the bundled sample data
npx convex run seed:seed
```

When deploying from CI / a non-interactive shell, set the
`CONVEX_DEPLOY_KEY` environment variable (from the Convex dashboard) before
running the commands above.

## Authentication

Auth is implemented with [Convex Auth](https://labs.convex.dev/auth) using the
email + password provider. The frontend is wrapped in `ConvexAuthProvider` and
gated with `<Authenticated>` / `<Unauthenticated>` so unauthenticated visitors
see the sign-in screen and only signed-in users reach the dashboard.

Backend pieces:

- `convex/auth.ts` — registers the `Password` provider
- `convex/auth.config.ts` — JWT issuer config
- `convex/http.ts` — mounts the auth HTTP routes
- `convex/users.ts` — exposes a `currentUser` query (uses `getAuthUserId`)

Convex Auth requires three deployment-side environment variables (set on your
Convex deployment, not in `.env.local`):

```bash
# URL where the frontend is served (used for redirects).
npx convex env set SITE_URL http://localhost:5173

# Generate a signing key + JWKS once and set them on the deployment.
node -e "import('jose').then(async ({ exportJWK, exportPKCS8, generateKeyPair }) => { \
  const k = await generateKeyPair('RS256', { extractable: true }); \
  const priv = (await exportPKCS8(k.privateKey)).trimEnd().replace(/\n/g, ' '); \
  const jwks = JSON.stringify({ keys: [{ use: 'sig', ...(await exportJWK(k.publicKey)) }] }); \
  console.log('JWT_PRIVATE_KEY=' + JSON.stringify(priv)); \
  console.log('JWKS=' + jwks); \
})"
# Copy the printed values into `npx convex env set JWT_PRIVATE_KEY ...` and
# `npx convex env set JWKS ...` (or set them via the Convex dashboard).
```

Once those are set, run `npx convex dev` (or `npx convex deploy` for
production) to push the auth functions, then visit the app — new users can
sign up directly from the sign-in screen.

## Build

```bash
npm run build
```

The production build is output to the `dist/` directory. Make sure
`VITE_CONVEX_URL` is set at build time so the deployed bundle points at the
correct Convex deployment.
