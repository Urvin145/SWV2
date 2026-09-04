# 🟢 Scrapwala — Project Documentation

> **"Uber for Scrap Collection"** — Doorstep scrap pickup platform for Bangalore  
> **Version:** 0.1.0 · **Framework:** Next.js 16 (App Router) · **Database:** Supabase (PostgreSQL)  
> **Repository:** [github.com/Urvin145/SWV2](https://github.com/Urvin145/SWV2)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Directory Structure](#3-directory-structure)
4. [Database Schema](#4-database-schema)
5. [Public Pages & Features](#5-public-pages--features)
6. [Booking Wizard (Customer Flow)](#6-booking-wizard-customer-flow)
7. [Order Tracking (Customer)](#7-order-tracking-customer)
8. [Admin Panel](#8-admin-panel)
9. [API Routes](#9-api-routes)
10. [Security & Middleware](#10-security--middleware)
11. [Shared Components & Utilities](#11-shared-components--utilities)
12. [Environment Variables](#12-environment-variables)
13. [Database Migrations](#13-database-migrations)
14. [SEO & Structured Data](#14-seo--structured-data)
15. [Known Fixes & Changelog](#15-known-fixes--changelog)

---

## 1. Project Overview

Scrapwala is a **doorstep scrap collection service** platform targeting Bangalore. Customers can:
- Browse live scrap rates (paper, plastic, metal, e-waste, glass, etc.)
- Book a free doorstep pickup via a 4-step wizard
- Track orders by phone number or booking number (guest mode, no account required)

Admins can:
- View KPI dashboard (total bookings, revenue, today's pickups, completion rate)
- Manage pickup orders (advance status: pending → confirmed → scheduled → completed)
- Complete pickups by recording actual weights per item with live payout calculation
- Edit scrap rates individually or via bulk Excel/CSV upload
- Add new scrap categories and items

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.3 (App Router, React 19) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 with custom M3-inspired design tokens |
| **Database** | Supabase (PostgreSQL) with RLS |
| **State Management** | Zustand (booking wizard), React Query (data fetching) |
| **Forms** | React Hook Form + Zod validation |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **UI Kit** | shadcn/ui + Base UI |
| **Excel Parsing** | SheetJS (xlsx) |
| **Fonts** | Inter, Public Sans, Geist (Google Fonts) |

---

## 3. Directory Structure

```
scrapwala/
├── app/                          # Next.js App Router pages & API routes
│   ├── page.tsx                  # Homepage (9 sections)
│   ├── layout.tsx                # Root layout (fonts, providers, SEO)
│   ├── globals.css               # Global styles + design tokens
│   ├── about/                    # /about — Company story & mission
│   ├── admin/                    # /admin — Admin panel pages
│   │   ├── layout.tsx            # Admin layout (sidebar + auth guard)
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── login/                # /admin/login — Admin login page
│   │   ├── pickups/              # /admin/pickups — Pickup management
│   │   └── rates/                # /admin/rates — Rate editing
│   ├── api/                      # API route handlers
│   │   ├── admin/                # Protected admin APIs
│   │   │   ├── bookings/         # Booking management
│   │   │   │   ├── route.ts      # GET all bookings
│   │   │   │   └── [id]/
│   │   │   │       ├── status/   # PATCH status transitions
│   │   │   │       └── complete/ # POST complete with weights
│   │   │   ├── categories/       # GET/POST scrap categories
│   │   │   ├── items/            # POST new scrap items
│   │   │   ├── login/            # POST admin login
│   │   │   ├── rates/            # PATCH single rate + POST /bulk
│   │   │   ├── session/          # GET/DELETE session
│   │   │   └── stats/            # GET dashboard KPIs
│   │   ├── blog/                 # GET published blog posts
│   │   ├── bookings/             # POST create / GET lookup bookings
│   │   ├── contact/              # POST contact form submission
│   │   ├── rates/                # GET public scrap rates
│   │   └── slots/                # GET available pickup slots
│   ├── blog/                     # /blog — Blog listing & detail
│   ├── book/                     # /book — Booking wizard + result pages
│   │   ├── page.tsx              # Booking wizard page
│   │   ├── completed/            # Booking success page
│   │   ├── scheduled/            # Booking scheduled page
│   │   └── cancelled/            # Booking cancelled page
│   ├── contact/                  # /contact — Contact form
│   ├── faq/                      # /faq — FAQ accordion (12 questions)
│   ├── orders/                   # /orders — Order lookup & detail
│   ├── privacy/                  # /privacy — Privacy policy
│   ├── rates/                    # /rates — Public rates listing
│   ├── terms/                    # /terms — Terms of service
│   ├── sitemap.ts                # Auto-generated sitemap
│   └── robots.ts                 # Robots.txt configuration
│
├── features/                     # Feature-based modules (collocated code)
│   ├── admin/components/         # Admin panel components
│   │   ├── AdminAuthGuard.tsx    # Auth gate (redirect to login)
│   │   ├── AdminDashboardClient.tsx  # KPI cards, ring chart, table
│   │   ├── AdminPickupsClient.tsx    # Pickup list, status, completion modal
│   │   ├── AdminRatesClient.tsx      # Rate cards, inline edit, add modals
│   │   ├── AdminSidebar.tsx          # Sidebar nav (responsive)
│   │   └── BulkRatesUploadModal.tsx  # Excel upload, diff preview, apply
│   ├── booking/                  # Booking wizard feature
│   │   ├── components/
│   │   │   ├── BookingWizard.tsx  # 4-step wizard orchestrator
│   │   │   ├── ScrapSelector.tsx # Step 1: Select scrap items
│   │   │   ├── SchedulePicker.tsx# Step 2: Pick date & time slot
│   │   │   ├── DetailsForm.tsx   # Step 3: Customer details
│   │   │   ├── BookingPreview.tsx# Step 4: Review & confirm
│   │   │   └── StepIndicator.tsx # Progress bar
│   │   ├── hooks/                # Custom hooks for booking
│   │   ├── services/             # API service layer
│   │   ├── store/                # Zustand store (bookingStore)
│   │   └── types/                # Booking type definitions
│   ├── blog/                     # Blog feature (listing + detail)
│   ├── content/                  # CMS content models
│   ├── home/components/          # Homepage sections
│   │   ├── HeroSection.tsx       # Hero with pincode checker
│   │   ├── HowItWorksSection.tsx # 3-step process
│   │   ├── ComparisonSection.tsx # Kabadiwala vs Scrapwala
│   │   ├── RatesPreviewSection.tsx   # Live rates preview
│   │   ├── EnvironmentalImpactSection.tsx # ESG metrics
│   │   ├── B2BSolutionsSection.tsx   # Enterprise solutions
│   │   ├── TrustMarkersSection.tsx   # Testimonials & stats
│   │   ├── HomeFAQSection.tsx        # Mini FAQ
│   │   ├── CTASection.tsx            # Final CTA banner
│   │   └── PincodeCheckerBar.tsx     # Pincode availability
│   ├── orders/                   # Order tracking feature
│   │   ├── components/
│   │   │   ├── OrdersPageClient.tsx  # Order search page
│   │   │   ├── OrderLookup.tsx       # Phone/booking# search
│   │   │   ├── OrderCard.tsx         # Order summary card
│   │   │   ├── OrderDetailClient.tsx # Full order detail view
│   │   │   └── OrderTimeline.tsx     # Status timeline
│   │   ├── hooks/                # Order hooks
│   │   ├── services/             # Order API services
│   │   └── types/                # Order type definitions
│   ├── rates/                    # Public rates feature
│   └── static/components/        # Static content pages
│       ├── AboutContent.tsx      # About page content
│       ├── ContactForm.tsx       # Contact form
│       └── FAQAccordion.tsx      # FAQ accordion
│
├── components/                   # Shared UI components
│   ├── common/                   # Reusable atoms
│   │   ├── AnimatedSection.tsx   # Scroll-triggered animation wrapper
│   │   ├── EmptyState.tsx        # Empty state placeholder
│   │   ├── Loader.tsx            # Spinner loader
│   │   ├── PageHeader.tsx        # Page title + description
│   │   ├── SectionHeading.tsx    # Section title component
│   │   ├── StatusBadge.tsx       # Status pill badge
│   │   ├── SweetLoader.tsx       # Animated truck loader
│   │   └── sweet-loader.css      # Truck animation CSS
│   ├── layout/                   # Layout components
│   │   ├── Header.tsx            # Site header/navbar
│   │   ├── Footer.tsx            # Site footer
│   │   ├── LayoutWrapper.tsx     # Header/Footer wrapper
│   │   ├── MobileNav.tsx         # Mobile hamburger menu
│   │   └── NavbarMiniAnimation.tsx # Animated mini truck
│   ├── providers/                # React context providers
│   └── ui/                       # shadcn/ui primitives
│
├── services/supabase/            # Supabase client wrappers
│   ├── client.ts                 # Browser client (public key)
│   ├── server.ts                 # Server client (SSR)
│   ├── admin.ts                  # Admin client (service role key)
│   └── middleware.ts             # Middleware client
│
├── lib/                          # Utility libraries
│   ├── utils.ts                  # cn(), sanitizeFilterValue(), etc.
│   ├── validators.ts             # Zod schemas (contact form, etc.)
│   ├── logger.ts                 # Structured logger with levels
│   └── rate-limit.ts             # Sliding window rate limiter
│
├── constants/config.ts           # APP_CONFIG (name, URLs, contact)
├── middleware.ts                  # Next.js middleware (auth, rate limit, headers)
├── types/                        # Global TypeScript types
│   ├── common.types.ts           # Shared types
│   └── database.types.ts         # Supabase auto-generated types
│
└── supabase/migrations/          # Database migration SQL files
    ├── 001_initial_schema.sql    # Core tables & triggers
    ├── 002_seed_data.sql         # Initial seed data
    ├── 003_storage_bucket.sql    # Photo upload bucket
    ├── 004_fix_booking_triggers.sql
    ├── 005_add_price_range.sql
    ├── 006_enable_rls_and_security.sql
    ├── 007_fix_linter_and_policy_hardening.sql
    ├── 008_add_truck_size.sql
    └── 009_allow_admin_order_status_updates.sql
```

---

## 4. Database Schema

### Core Tables

```
┌────────────────────┐       ┌────────────────────┐
│  scrap_categories  │       │    scrap_items      │
├────────────────────┤       ├────────────────────┤
│ id (PK)            │◄──────│ category_id (FK)   │
│ name               │       │ id (PK)            │
│ slug (UNIQUE)      │       │ name               │
│ description        │       │ slug (UNIQUE)      │
│ icon_url           │       │ description        │
│ image_url          │       │ unit (default: kg) │
│ sort_order         │       │ is_active          │
│ is_active          │       │ sort_order         │
└────────────────────┘       └────────┬───────────┘
                                      │
                             ┌────────▼───────────┐
                             │    scrap_rates      │
                             ├────────────────────┤
                             │ id (PK)            │
                             │ scrap_item_id (FK) │
                             │ price_per_unit     │
                             │ city (Bangalore)   │
                             │ effective_from     │
                             │ effective_to       │
                             │ is_current (bool)  │
                             └────────────────────┘

┌────────────────────┐       ┌────────────────────┐
│    pickup_slots     │       │     bookings       │
├────────────────────┤       ├────────────────────┤
│ id (PK)            │◄──────│ slot_id (FK)       │
│ start_time         │       │ id (PK)            │
│ end_time           │       │ booking_number     │  ← auto: SW-YYYYMMDD-NNN
│ label              │       │ customer_name      │
│ max_bookings_day   │       │ customer_phone     │
│ is_active          │       │ address_line_1/2   │
└────────────────────┘       │ city / state       │
                             │ pincode            │
                             │ status (enum)      │  ← pending/confirmed/
                             │ pickup_date        │     scheduled/completed/
                             │ estimated_value    │     cancelled
                             │ actual_value       │
                             │ weight_total       │
                             │ customer_notes     │
                             │ truck_size         │
                             │ est_price_range    │
                             │ scrap_photo_urls   │
                             │ confirmed_at       │
                             │ completed_at       │
                             │ cancelled_at       │
                             └────────┬───────────┘
                                      │
                             ┌────────▼───────────┐
                             │   booking_items     │
                             ├────────────────────┤
                             │ id (PK)            │
                             │ booking_id (FK)    │
                             │ scrap_item_id (FK) │
                             │ estimated_weight   │
                             │ actual_weight      │  ← filled on completion
                             │ rate_applied       │
                             │ subtotal           │  ← recalculated on completion
                             └────────────────────┘

┌─────────────────────┐      ┌────────────────────┐
│ booking_status_logs  │      │   blog_posts       │
├─────────────────────┤      ├────────────────────┤
│ id (PK)             │      │ id (PK)            │
│ booking_id (FK)     │      │ title / slug       │
│ previous_status     │      │ excerpt / content  │
│ new_status          │      │ cover_image_url    │
│ notes               │      │ author_name        │
│ created_at          │      │ is_published       │
└─────────────────────┘      │ published_at       │
                             └────────────────────┘

┌────────────────────┐
│ contact_submissions │
├────────────────────┤
│ id (PK)            │
│ name / email       │
│ phone / subject    │
│ message            │
│ is_read            │
└────────────────────┘
```

### Key Database Features
- **Booking number auto-generation:** Trigger creates `SW-YYYYMMDD-NNN` format
- **Status timestamps:** Trigger auto-sets `confirmed_at`, `completed_at`, `cancelled_at`
- **Status audit log:** Every status change is logged to `booking_status_logs`
- **Auto `updated_at`:** Trigger on all tables with `updated_at` column
- **Row Level Security (RLS):** Enabled with policies for public reads and admin writes

---

## 5. Public Pages & Features

### Homepage (`/`)
Nine sections with animations and interactive elements:

| # | Section | Description |
|---|---------|-------------|
| 1 | **Hero** | Headline, pincode availability checker, dual CTA buttons, floating rates card |
| 2 | **How It Works** | 3-step process: Schedule → We Collect → Get Paid |
| 3 | **Comparison** | Traditional Kabadiwala vs Scrapwala feature matrix |
| 4 | **Rates Preview** | Top live scrap rates fetched from DB with category tags |
| 5 | **Environmental Impact** | Real-time ESG metrics (Trees, Water, Energy, Landfill saved) |
| 6 | **B2B Solutions** | IT offices, Apartment societies, Warehouses |
| 7 | **Trust Markers** | Customer stats, testimonials, trust signals |
| 8 | **FAQ** | Accordion Q&A for friction reduction |
| 9 | **CTA Banner** | Final high-converting pickup scheduling CTA |

### Rates Page (`/rates`)
- Category-tabbed scrap rate browser
- Search and filter by category
- Live rates from Supabase `scrap_rates` table

### Blog (`/blog`, `/blog/[slug]`)
- Blog listing with card grid
- Individual post detail pages
- Pulls from `blog_posts` table (only `is_published = true`)

### FAQ (`/faq`)
- 12 curated Q&A items in accordion layout
- Schema.org FAQPage structured data for SEO

### Contact (`/contact`)
- Contact form (name, email, phone, subject, message)
- Validated with Zod, stored in `contact_submissions` table
- Rate limited (10 per minute per IP)

### Static Pages
- **About** (`/about`) — Company mission, values, story
- **Privacy Policy** (`/privacy`) — Privacy policy content
- **Terms of Service** (`/terms`) — Terms and conditions

---

## 6. Booking Wizard (Customer Flow)

**Route:** `/book` → 4-step wizard powered by Zustand store

### Step 1: Select Scrap Items (`ScrapSelector`)
- Browse scrap items grouped by category
- Select items and enter estimated weight range
- Shows current rate per kg for each item
- Calculates estimated value live

### Step 2: Schedule Pickup (`SchedulePicker`)
- Pick a date (up to 7 days ahead)
- Select available time slot
- Slot availability checked via `/api/slots?date=YYYY-MM-DD`
- Shows remaining capacity per slot

### Step 3: Customer Details (`DetailsForm`)
- Name, phone (Indian format validated), address, pincode
- Optional: customer notes, scrap photos
- Truck size selection
- Validated with React Hook Form + Zod

### Step 4: Review & Confirm (`BookingPreview`)
- Summary of all selections
- Estimated value calculation (weight midpoint x avg rate)
- Submit creates booking via `POST /api/bookings`
- On success → redirected to `/book/completed` or `/book/scheduled`

### Booking Number Format
```
SW-20260904-001
└─┘ └────────┘ └─┘
 |       |       └── Sequential number (zero-padded)
 |       └────────── Date (YYYYMMDD)
 └────────────────── Prefix
```

---

## 7. Order Tracking (Customer)

**Route:** `/orders`

### Order Lookup (`OrderLookup`)
- Search by phone number OR booking number
- No account/login required (guest mode)
- Results show list of matching orders

### Order Detail (`/orders/[id]`)
- Full booking details: items, weights, values, address
- **Status Timeline** (`OrderTimeline`) — visual step-by-step progress
- Status badge with color coding
- Shows estimated vs actual values (if completed)

---

## 8. Admin Panel

**Route:** `/admin/*` — Protected by session cookie authentication

### Authentication
- **Login** (`/admin/login`): Username + password from environment variables
- **Session**: `admin_session` httpOnly cookie (24hr expiry, crypto UUID token)
- **Auth Guard** (`AdminAuthGuard`): Redirects to login if no session
- **Logout**: `DELETE /api/admin/session` clears the cookie

### Dashboard (`/admin`)
KPI overview with:

| Widget | Description |
|--------|-------------|
| **Total Bookings** | Count of all non-deleted bookings |
| **Revenue Earned** | Sum of `actual_value` from completed bookings |
| **Today's Pickups** | Bookings scheduled for today |
| **Completion Rate** | `completed / total x 100%` |
| **Status Ring Chart** | SVG donut chart showing status distribution |
| **Category Breakdown** | Horizontal bar chart by scrap category |
| **Recent Bookings** | Last 10 bookings table |

### Manage Pickups (`/admin/pickups`)
- **Search**: Filter by booking number, customer name, or phone
- **Status Filter Tabs**: All, Pending, Confirmed, Scheduled, Completed, Cancelled
- **Booking Cards**: Expandable cards showing:
  - Customer info, address, pickup date/slot
  - Items list with weights and rates
  - Estimated value and total payout
- **Status Transitions** (button on each card):
  - Pending → Confirmed
  - Confirmed → Scheduled
  - Scheduled → Complete (opens weight modal)
  - Any → Cancel (with reason)
- **Complete Pickup Modal** (`CompletePickupModal`):
  - Scrollable list of items with weight input fields
  - Live subtotal per item (weight x rate)
  - Running grand total at bottom
  - Search/filter items when list is long
  - "Fill All Estimated" quick-fill button
  - Sticky header/footer for accessibility
  - Handles any number of items with overflow scroll

### Edit Rates (`/admin/rates`)
- **Category Tabs**: Switch between scrap categories
- **Item Cards**: Display item name, unit, current rate
- **Inline Price Edit**: Click pencil → type new price → save
- **Add Category**: Modal to create new scrap category
- **Add Item**: Modal to add scrap item to a category
- **Bulk Upload** (`BulkRatesUploadModal`):
  - Download current rates as Excel template
  - Upload modified Excel/CSV file
  - Visual diff preview (old price → new price, with up/down indicators)
  - Filter: All / Changed Only / Unchanged
  - One-click "Apply All Changes"
  - Error reporting per item

---

## 9. API Routes

### Public APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/rates` | Fetch all current scrap rates (with category data) |
| `GET` | `/api/rates?category=slug` | Filter rates by category |
| `GET` | `/api/slots?date=YYYY-MM-DD` | Get available pickup slots for a date |
| `POST` | `/api/bookings` | Create a new guest booking |
| `GET` | `/api/bookings?phone=XXX` | Lookup bookings by phone |
| `GET` | `/api/bookings?number=SW-XXX` | Lookup booking by number |
| `POST` | `/api/contact` | Submit contact form |
| `GET` | `/api/blog` | List published blog posts |

### Admin APIs (Protected — requires `admin_session` cookie)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Authenticate admin |
| `GET` | `/api/admin/session` | Verify session |
| `DELETE` | `/api/admin/session` | Logout (clear cookie) |
| `GET` | `/api/admin/stats` | Dashboard KPI data |
| `GET` | `/api/admin/bookings` | List all bookings with items |
| `PATCH` | `/api/admin/bookings/[id]/status` | Update booking status |
| `POST` | `/api/admin/bookings/[id]/complete` | Complete with actual weights |
| `PATCH` | `/api/admin/rates/[id]` | Update a single rate |
| `POST` | `/api/admin/rates/bulk` | Bulk update rates from Excel |
| `GET` | `/api/admin/categories` | List scrap categories |
| `POST` | `/api/admin/categories` | Create scrap category |
| `POST` | `/api/admin/items` | Create scrap item |

### Status Transition Rules

```
pending ──► confirmed ──► scheduled ──► completed
   |              |              |
   └──► cancelled └──► cancelled └──► cancelled
```

Valid transitions enforced server-side:
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `scheduled`, `cancelled`
- `scheduled` → `completed` (via complete endpoint only), `cancelled`

---

## 10. Security & Middleware

### Middleware Pipeline (`middleware.ts`)
Runs on every matched request (excludes static assets):

1. **Admin Route Protection**: Validates `admin_session` cookie on `/api/admin/*` (except `/api/admin/login`)
2. **Rate Limiting** (sliding window, in-memory):
   - Login: 5 attempts / 15 minutes per IP
   - Booking & Contact forms: 10 / minute per IP
   - General API: 60 / minute per IP
3. **Security Headers** on all responses:
   - Content-Security-Policy (script, style, font, connect sources)
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Strict-Transport-Security (HSTS, 1 year)
   - Referrer-Policy: strict-origin-when-cross-origin
   - Permissions-Policy (camera, mic, geo, payment)
   - X-XSS-Protection: 1; mode=block

### Input Validation & Sanitization
- All user inputs validated with **Zod** schemas
- Filter values sanitized via `sanitizeFilterValue()` to prevent Supabase filter injection
- Phone numbers normalized (strip `+91` prefix)

### Row Level Security (RLS)
- Enabled on all tables (migration 006, 007, 009)
- Public: read-only access to categories, items, rates, slots, blog posts
- Bookings: insert by anyone, select/update restricted
- Admin operations use `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS)

### Supabase Client Separation
- **Browser client** (`client.ts`): Public anon key, used in client components
- **Server client** (`server.ts`): Cookie-based SSR client
- **Admin client** (`admin.ts`): Service role key, bypasses RLS for admin APIs

---

## 11. Shared Components & Utilities

### Layout Components
| Component | Description |
|-----------|-------------|
| `Header` | Main navigation bar with logo, links, mobile menu |
| `Footer` | Footer with links, social, contact info |
| `LayoutWrapper` | Wraps pages with Header + Footer |
| `MobileNav` | Slide-out mobile navigation |
| `NavbarMiniAnimation` | Animated mini-truck in navbar (CSS-only) |

### Common Components
| Component | Description |
|-----------|-------------|
| `AnimatedSection` | Scroll-triggered fade/slide animation wrapper |
| `EmptyState` | Placeholder for empty data states |
| `Loader` | Spinner component |
| `PageHeader` | Reusable page title + description banner |
| `SectionHeading` | Section title with optional subtitle |
| `StatusBadge` | Color-coded status pill (pending/confirmed/etc.) |
| `SweetLoader` | Animated mini-truck loading screen |

### Utility Libraries (`lib/`)
| File | Exports |
|------|---------|
| `utils.ts` | `cn()` (class merge), `sanitizeFilterValue()`, formatters |
| `validators.ts` | Zod schemas: `contactFormSchema`, etc. |
| `logger.ts` | `createLogger()` — structured logger with levels (info/warn/error) |
| `rate-limit.ts` | `createRateLimiter()`, pre-configured: `loginLimiter`, `formLimiter`, `apiLimiter` |

---

## 12. Environment Variables

```env
# Required — Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Required — Admin Panel (login fails without these)
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-strong-password

# Optional — App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Scrapwala
NEXT_PUBLIC_WHATSAPP_NUMBER=91XXXXXXXXXX
NEXT_PUBLIC_CONTACT_PHONE=+91-XXXXXXXXXX

# Optional — Logging
LOG_LEVEL=info   # info | warn | error
```

> **Important:** `ADMIN_USERNAME` and `ADMIN_PASSWORD` must be set in `.env.local` — the admin login returns `503 Admin login is not configured` if missing.

---

## 13. Database Migrations

Run these in order in Supabase SQL Editor:

| # | File | Description |
|---|------|-------------|
| 001 | `initial_schema.sql` | All core tables, enums, triggers (categories, items, rates, slots, bookings, booking_items, status_logs, blog, contacts) |
| 002 | `seed_data.sql` | Initial categories (Paper, Plastic, Metal, E-Waste, Glass, Others), scrap items, rates, and pickup slots |
| 003 | `storage_bucket.sql` | Supabase storage bucket for scrap photos |
| 004 | `fix_booking_triggers.sql` | Fix booking number generation and status triggers |
| 005 | `add_price_range.sql` | Add `estimated_price_range`, `estimated_weight_min/max` columns |
| 006 | `enable_rls_and_security.sql` | Enable RLS on all tables with granular policies |
| 007 | `fix_linter_and_policy_hardening.sql` | Refine RLS policies, fix linter warnings |
| 008 | `add_truck_size.sql` | Add `truck_size` column to bookings |
| 009 | `allow_admin_order_status_updates.sql` | RLS policy for admin status changes via service role |

---

## 14. SEO & Structured Data

### Metadata
- Every page has unique `<title>` and `<meta description>`
- OpenGraph and Twitter Card metadata on all pages
- `robots.ts` allows indexing all public pages
- `sitemap.ts` auto-generates XML sitemap for all routes

### Structured Data (JSON-LD)
- **Homepage**: `LocalBusiness` schema + `FAQPage` schema
- **FAQ Page**: `FAQPage` schema with all 12 Q&A items
- Schema markup embedded via `<script type="application/ld+json">`

### Fonts & Performance
- **Inter** (headlines + body), **Public Sans** (labels/UI), **Geist** (code)
- `display: 'swap'` for font loading performance
- Images optimized via Next.js `<Image>` component

---

## 15. Known Fixes & Changelog

### Bugs Fixed (Session: Sep 2026)

| Issue | Root Cause | Fix |
|-------|------------|-----|
| **"Admin login not configured"** | `ADMIN_USERNAME` / `ADMIN_PASSWORD` missing from `.env.local` | Added env vars |
| **Admin panel "internal error"** | Service role key missing / RLS blocking admin queries | Used `createAdminClient()` (service role) for admin APIs |
| **Cannot change order status** | RLS policies blocking `UPDATE` on `bookings` table | Added migration 009 allowing service role status updates |
| **Estimated value showing Rs.5.5** | Backend saving weight midpoint (5.5 kg) directly as currency value | Fixed formula: `midpoint x avg_rate` |
| **Weight bar not showing with many items** | Modal had no `max-height`/scroll; items overflowed viewport | Added scrollable container with sticky header/footer |
| **Bulk Excel rate update failing** | Matching by `slug` field instead of `scrap_item_id`; RLS blocking inserts | Fixed to use `scrap_item_id`, added 3-tier update logic (update current → update any → insert new) |

### Features Added (Session: Sep 2026)

| Feature | Description |
|---------|-------------|
| **Total Payout Summary** | Admin pickup cards show grand total payout with emerald badge |
| **Bulk Rates Upload** | Download Excel template → edit → upload → preview diff → apply all |
| **Enhanced Weight Modal** | Scrollable, searchable, with live calculations and quick-fill |
| **Card Item Scroll** | Cards with >5 items auto-scroll in admin list view |

---

## Quick Start

```bash
# 1. Clone the repo
git clone https://github.com/Urvin145/SWV2.git
cd scrapwala

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials and admin password

# 4. Run database migrations
# Run SQL files 001-009 in Supabase SQL Editor in order

# 5. Start dev server
npm run dev

# 6. Open in browser
# Customer site: http://localhost:3000
# Admin panel:   http://localhost:3000/admin/login
```

---

*Last updated: September 4, 2026*
