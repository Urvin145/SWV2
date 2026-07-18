# 🟢 Scrapwala — Customer Web Portal

> **Uber for Scrap Collection** — A digital platform where customers can schedule doorstep scrap pickups.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui |
| Icons | Lucide React |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack React Query |
| State | Zustand |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| Deployment | Vercel |

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Supabase project (or use `.env.local.example` as reference)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local

# 3. Fill in your Supabase URL and anon key in .env.local

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Architecture

This project uses **Feature-First Architecture**:

```
├── app/              → Next.js App Router pages
├── components/       → Shared UI components
│   ├── ui/           → shadcn/ui primitives
│   ├── layout/       → Header, Footer, MobileNav
│   ├── common/       → Loader, EmptyState, StatusBadge, PageHeader
│   └── forms/        → Reusable form components
├── features/         → Feature modules (domain logic)
│   ├── home/         → Homepage sections
│   ├── rates/        → Scrap rates browsing
│   ├── booking/      → Booking wizard
│   ├── orders/       → Order lookup & details
│   └── content/      → Blog, FAQ, Contact
├── services/         → Supabase client configuration
├── hooks/            → Global custom hooks
├── types/            → Global TypeScript types
├── lib/              → Utility functions (cn, formatters)
├── constants/        → Route paths, app config, categories
└── public/           → Static assets
```

## Design System

Colors and typography from the **Stitch** design system:

| Token | Value |
|-------|-------|
| Primary (Mint) | `#0F8A5F` |
| Secondary (Ink) | `#11201C` |
| Tertiary (Amber) | `#F4B740` |
| Background | `#ECFDF7` |
| Headline Font | Inter |
| Body Font | Inter |
| Label Font | Public Sans |
| Card Radius | 8px |
| Spacing Base | 8px |

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Phase 1 Scope

- ✅ Homepage (direct landing, no login)
- ✅ Scrap Rates browsing
- ✅ Guest booking wizard
- ✅ Order lookup by phone/booking number
- ✅ Static pages (About, FAQ, Blog, Contact, Privacy, Terms)
- ❌ Auth/Login (future)
- ❌ User profiles (future)
- ❌ Live GPS tracking (future)
- ❌ Rewards system (future)
