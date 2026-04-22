# redalpine Portfolio Intelligence

AI-powered investment thesis memo generator for the redalpine portfolio.

Built as a demonstration of applied LLM tooling in a VC context.

## What it does

- Displays the full redalpine portfolio (60+ companies)
- Filter by sector, status, or search
- Click any company → generates a VC-grade investment thesis memo via Claude API
- Memos are cached client-side per session

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude API (server-side route, key never exposed to client)

## Run locally

```bash
npm install
cp .env.local.example .env.local
# Add your Anthropic API key to .env.local
npm run dev
```

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add `ANTHROPIC_API_KEY` as an environment variable
4. Deploy

---

Built by Darius-Alexandru Farcas
