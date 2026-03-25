# Gold Country Guide — Project Overview

## What This Is
A Next.js directory site at **goldcountry.guide** connecting homeowners with local contractors in California's Gold Country foothills. Monetization is via contractor memberships (free/pro/premium tiers) with lead routing priority.

## Repo & Deployment
- **GitHub:** `github.com/ColdieArt/goldcountry-guide`
- **Branch:** `main` (push to main triggers Vercel deploy)
- **Framework:** Next.js 16.1.6 (App Router), React 19, Tailwind CSS 4, TypeScript
- **Hosting:** Vercel (auto-deploys from `main`)

## Git Workflow
- Work on `main` or create feature branches prefixed `claude/`
- Always run `npx next build` before pushing to verify no build errors
- Push directly to `main` to deploy: `git push origin main`

## Environment Variables (set in Vercel dashboard)
| Variable | Purpose |
|---|---|
| `RESEND_API_KEY` | Email delivery for form submissions (resend.com, free tier = 100/day) |

## Commands
```bash
npm run dev          # Local dev server
npm run build        # Production build (always run before pushing)
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Architecture

### Routes (`src/app/`)
| Route | Purpose |
|---|---|
| `/` | Homepage — hero with inline lead capture, building options, featured contractors, trades grid, cities grid, cost guides |
| `/[slug]` | Dynamic hub for trades (`/plumbers`) or cities (`/auburn`) |
| `/[slug]/[subSlug]` | Contractor profile pages (`/plumbers/jones-plumbing`) or trade+city combos (`/plumbers/auburn`) |
| `/cost/[slug]` | Cost guide pages |
| `/projects/[slug]` | Project showcase pages |
| `/request` | Multi-step conversational lead capture form (7 steps) |
| `/api/submit-request` | POST endpoint — sends form data as email to coldieart@gmail.com via Resend |
| `/admin/leads` | Lead routing simulator (dev/admin tool) |

### Components (`src/components/`)
| Component | Notes |
|---|---|
| `Header.tsx` | Site nav with trade links and city bar |
| `Footer.tsx` | Site footer |
| `HeroLeadCapture.tsx` | **Client component** — inline text input on homepage, stores answer in localStorage and navigates to `/request` |
| `RequestForm.tsx` | **Client component** — 7-step conversational lead form (service category → trade → city → description → budget/timeline → contact info → review & submit) |
| `GoldCountryMap.tsx` | **Client component** — Leaflet interactive map with city markers and colored trade pins |
| `GoldCountryMapWrapper.tsx` | Dynamic import wrapper for the map (avoids SSR issues with Leaflet) |
| `QuickStart.tsx` | Guided project quick-start flow |
| `JsonLd.tsx` | Structured data for SEO |

### Data Layer (`src/data/`)
All data is static TypeScript — no database. Edit these files directly.

| File | Contents |
|---|---|
| `trades.ts` | Trade definitions (plumbers, electricians, roofers, HVAC, architects, etc.) |
| `cities.ts` | City definitions (Auburn, Grass Valley, Nevada City, Rocklin, Placerville, etc.) |
| `contractors.ts` | Contractor profiles with membership tiers, service areas, specialties |
| `reviews.ts` | Review data with helper functions (getAverageRating, getReviewCount) |
| `cost-guides.ts` | Cost estimate data for common projects |
| `building-options.ts` | Building categories (Custom Home, ADU, Remodel, ADA) |
| `projects.ts` | Project showcase entries |
| `types.ts` | Shared TypeScript interfaces |
| `index.ts` | Barrel exports |

### Business Logic (`src/lib/`)
| File | Purpose |
|---|---|
| `submissions.ts` | `submitProjectRequest()` — POSTs form data to `/api/submit-request` |
| `lead-routing.ts` | Matches incoming leads to eligible contractors by trade, city, membership tier |
| `lead-scoring.ts` | Scores and prioritizes contractor matches |

## Key Design Decisions
- **No database** — all content is in TypeScript data files for simplicity and speed
- **Static generation** — most pages are statically generated at build time via `generateStaticParams`
- **Email for leads** — form submissions go to coldieart@gmail.com; no CRM yet
- **Grayscale + gold accents** — black/white/gray design with amber/yellow-700 highlights
- **Lead routing** — contractors are matched by trade + city coverage; premium members get priority
- **Conversational form** — the request form walks users through one question at a time (not a wall of fields)
- **Hero lead capture** — homepage has an inline "What do you need help with?" input that pre-fills and opens the full form

## What's Been Built (chronological)
1. Foundation: data layer, layout shell, core routes
2. City and trade data (Auburn, Placerville, Grass Valley, Nevada City, Rocklin, etc.)
3. Dynamic pages for trades, cities, contractors, cost guides, projects
4. Full page template redesigns (city hubs, trade hubs, contractor profiles)
5. Guided project quick-start and request form
6. Membership tiers and lead routing/scoring business logic
7. Admin lead simulator
8. SEO foundations (JSON-LD, meta tags)
9. Interactive Leaflet map with city markers and trade-colored pins
10. Visual design: grayscale theme, gold accents, city menubar, ripple animation
11. Building options categories (Custom Home, ADU, Remodel, ADA)
12. Nav restructuring (trade links, building options on homepage)
13. Conversational multi-step lead capture form (replaced old single-page form)
14. Inline hero lead capture input
15. Email delivery of form submissions via Resend API

## Adding a New Contractor
Edit `src/data/contractors.ts` — add an entry to the `contractors` array following the existing shape. The contractor will automatically appear on relevant trade/city pages.

## Adding a New Trade or City
Edit `src/data/trades.ts` or `src/data/cities.ts`. Pages are auto-generated from the data.
