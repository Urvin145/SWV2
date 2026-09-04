# 🚀 Scrapwala — Strategy, Growth & Investor Readiness

> This document covers everything **NOT** in `PROJECT_DOCUMENTATION.md` — business strategy, go-to-market plan, security hardening, scaling roadmap, competitive landscape, and investor pitch material.

---

## Table of Contents

1. [MVP Readiness Checklist](#1-mvp-readiness-checklist)
2. [Go-To-Market (GTM) Strategy](#2-go-to-market-gtm-strategy)
3. [Security Hardening Roadmap](#3-security-hardening-roadmap)
4. [Scaling for User Growth](#4-scaling-for-user-growth)
5. [Competitive Landscape](#5-competitive-landscape)
6. [Investor Pitch Deck Outline](#6-investor-pitch-deck-outline)
7. [Business Model & Revenue Streams](#7-business-model--revenue-streams)
8. [Key Metrics & KPIs to Track](#8-key-metrics--kpis-to-track)
9. [Regulatory & Legal Compliance](#9-regulatory--legal-compliance)
10. [Future Roadmap (Phase 2–4)](#10-future-roadmap-phase-24)
11. [Risk Analysis & Mitigation](#11-risk-analysis--mitigation)
12. [Unit Economics](#12-unit-economics)

---

## 1. MVP Readiness Checklist

### What's Ready (Phase 1 — Done)

| Feature | Status | Notes |
|---------|--------|-------|
| Customer-facing website | ✅ Done | 10 pages, responsive, animated |
| Live scrap rates from DB | ✅ Done | Category-filtered, auto-updated |
| 4-step booking wizard | ✅ Done | Scrap → Schedule → Details → Confirm |
| Guest-mode order tracking | ✅ Done | By phone or booking number |
| Admin dashboard with KPIs | ✅ Done | Revenue, bookings, status ring chart |
| Admin pickup management | ✅ Done | Status flow + weight completion modal |
| Admin rate editing | ✅ Done | Inline + bulk Excel upload |
| Security middleware | ✅ Done | Auth, rate limiting, CSP, HSTS |
| SEO + Structured Data | ✅ Done | Schema.org, sitemap, OG tags |
| Blog CMS | ✅ Done | Supabase-backed blog system |
| Contact form | ✅ Done | Validated, rate-limited |

### What's Missing for Production Launch

| Gap | Priority | Effort | Details |
|-----|----------|--------|---------|
| **WhatsApp / SMS notifications** | 🔴 Critical | Medium | Booking confirmation, status updates, pickup reminders via WhatsApp Business API or Twilio |
| **Payment integration (UPI)** | 🔴 Critical | Medium | Record digital payment proof; Razorpay/PhonePe PG for future |
| **Mobile app (or PWA)** | 🟡 High | High | Convert to PWA first (installable, push notifications, offline) |
| **Photo upload for scrap** | 🟡 High | Low | Storage bucket exists (migration 003) but UI not connected |
| **Google Maps integration** | 🟡 High | Medium | Address autocomplete, pin location, route optimization for drivers |
| **Driver/executive app** | 🟡 High | High | Separate mobile view for pickup executives with route, weights, payment |
| **Email transactional** | 🟢 Medium | Low | Booking confirmation email via Resend/SendGrid |
| **Analytics (GA4 / PostHog)** | 🟢 Medium | Low | Track conversion funnel, drop-off rates |
| **Error monitoring (Sentry)** | 🟢 Medium | Low | Catch production errors with context |
| **Referral system** | 🟢 Medium | Medium | "Invite a friend, earn ₹X" |
| **Multi-city support** | 🟢 Medium | Medium | City selector, city-specific rates |
| **Customer ratings/reviews** | 🟢 Medium | Medium | Post-pickup feedback + star rating |
| **Invoice/receipt generation** | 🟢 Medium | Low | Auto PDF receipt after pickup completion |
| **Pincode coverage database** | 🟢 Medium | Low | Replace static pincode checker with DB-backed table |

---

## 2. Go-To-Market (GTM) Strategy

### Phase 1: Soft Launch (Month 1–2) — Ahmedabad Only

**Target:** 100–200 bookings in first 60 days

| Channel | Action | Budget |
|---------|--------|--------|
| **WhatsApp Groups** | Post in apartment/society WhatsApp groups with rate card images | ₹0 |
| **Door-to-door flyers** | Print flyers with QR code → booking page; distribute in target apartments | ₹5K–10K |
| **Google My Business** | Register as local business; encourage reviews | ₹0 |
| **Instagram Reels** | Short videos: "How much is your scrap worth?" — with live rate cards | ₹0–2K |
| **Apartment Society partnerships** | Offer bulk pickups + dedicated monthly schedule for RWAs | ₹0 |
| **Referral rewards** | ₹50 cashback for referrer + referee on first booking | ₹5K–10K |

### Phase 2: Growth (Month 3–6)

| Channel | Action |
|---------|--------|
| **Google Ads (Local)** | Target: "sell scrap Ahmedabad", "kabadiwala near me", "scrap pickup doorstep" |
| **SEO content marketing** | Blog: "Scrap rates in Ahmedabad today", "How to dispose e-waste legally" |
| **Partnership with waste NGOs** | Co-brand for ESG credibility |
| **Corporate/IT Park tie-ups** | Offer bulk e-waste disposal for offices (B2B) |
| **Apartment app listings** | NoBroker, MyGate, ADDA marketplace listings |

### Phase 3: Scale (Month 6–12)

| Channel | Action |
|---------|--------|
| **Performance marketing** | Facebook/Instagram ads to apartment dwellers |
| **Influencer marketing** | Ahmedabad lifestyle micro-influencers (5K–50K followers) |
| **PR/media coverage** | Pitch to YourStory, Inc42, local Ahmedabad publications |
| **Expand to 2–3 new cities** | Hyderabad, Chennai, Pune (validated by competitor presence) |

### Target Customer Segments (Priority Order)

| Segment | Why | How to Reach |
|---------|-----|--------------|
| **Apartment residents (20–45)** | High volume, regular scrap, tech-savvy | WhatsApp, society partnerships, MyGate |
| **Office/IT parks** | Bulk e-waste, paper, regular contract | Direct sales, cold email, LinkedIn |
| **Households (spring cleaning)** | Event-driven spikes (Diwali, moving) | Google Ads, seasonal campaigns |
| **Small shops/vendors** | Cardboard, packaging waste daily | Ground team, door-to-door |
| **Manufacturing/warehouses** | High-value metal scrap, bulk | B2B sales, industrial directories |

---

## 3. Security Hardening Roadmap

### Already Implemented ✅

| Security Measure | Status |
|-----------------|--------|
| Admin auth via httpOnly session cookie | ✅ |
| Rate limiting on login (5/15min), forms (10/min), APIs (60/min) | ✅ |
| CSP, HSTS, X-Frame-Options, X-XSS-Protection | ✅ |
| Input validation (Zod schemas) | ✅ |
| Supabase filter injection prevention | ✅ |
| Row Level Security (RLS) on all tables | ✅ |
| Service role key only server-side | ✅ |
| CORS restricted via Next.js defaults | ✅ |

### Must-Fix Before Production 🔴

| Issue | Risk | Fix |
|-------|------|-----|
| **Admin password in .env (plaintext)** | High — env leak = full admin access | Hash passwords with bcrypt; store hash in DB, not env |
| **No session store** | Medium — session cookie is UUID but not stored server-side; can't revoke sessions | Store session tokens in DB/Redis with expiry; validate on each request |
| **No CSRF protection** | Medium — admin actions vulnerable to cross-site forgery | Add CSRF tokens to admin mutation endpoints |
| **In-memory rate limiter** | Medium — resets on server restart; doesn't work across instances | Migrate to Redis-backed limiter (Upstash) for Vercel/serverless |
| **No audit logging** | Medium — who changed what rate, when? | Add `updated_by`, `action`, `timestamp` to admin mutations |
| **Service role key in API routes** | Medium — if any admin route has a bug, full DB access | Add fine-grained RLS policies; reduce service role usage |
| **No request body size limit** | Low — potential DoS via large payloads | Add body size limits in middleware |

### Should-Add Before Scale 🟡

| Enhancement | Purpose |
|-------------|---------|
| **2FA for admin** | TOTP-based second factor (Google Authenticator) |
| **IP allowlist for admin** | Restrict admin panel to known IPs |
| **Webhook signature verification** | If adding Razorpay/Twilio webhooks |
| **API key authentication** | For future mobile app or third-party integrations |
| **Content Security Policy nonce** | Replace `'unsafe-inline'` with nonce-based scripts |
| **Dependency vulnerability scanning** | `npm audit` in CI/CD; Snyk/Socket integration |
| **Penetration testing** | Before handling real customer data at scale |
| **GDPR/privacy compliance** | Data deletion requests, consent management |
| **Secrets management** | Move from .env files to Vault or cloud secrets manager |

---

## 4. Scaling for User Growth

### Architecture Evolution Path

```
Current (Phase 1)              Scale (Phase 2)              Enterprise (Phase 3)
──────────────────             ──────────────               ────────────────────
Vercel (single app)     →     Vercel + Edge Functions   →   Microservices
Supabase Free/Pro       →     Supabase Pro + Read Replica → Supabase Enterprise / RDS
In-memory rate limit    →     Upstash Redis              →   Dedicated Redis cluster
No caching              →     ISR + CDN caching          →   Redis cache layer
No queue                →     Inngest / QStash           →   SQS/Bull queues
No monitoring           →     Sentry + PostHog           →   DataDog / Grafana
```

### Database Scaling Checklist

| Users | Action Needed |
|-------|--------------|
| **0–1K bookings** | Current setup is fine. Free Supabase tier. |
| **1K–10K bookings** | Supabase Pro plan. Add indexes on `pickup_date`, `status`. Enable connection pooling (PgBouncer). |
| **10K–50K bookings** | Read replica for analytics queries. Separate admin stats API to use replica. Archive old completed bookings. |
| **50K+ bookings** | Partitioning on `bookings` table by `pickup_date`. Consider PostGIS for geo-queries. Dedicated DB instance. |

### Frontend Performance

| Current | Improvement |
|---------|-------------|
| Full client-side rendering for rates | **ISR (Incremental Static Regeneration)** — regenerate every 5 minutes |
| No image optimization for blog | Use Next.js `<Image>` with Vercel Image Optimization |
| No CDN for static assets | Vercel Edge Network handles this automatically |
| Large JS bundle (xlsx library) | Lazy-load `xlsx` only when bulk upload modal opens |
| No service worker | **PWA** — offline rates page, push notifications |

### Operational Scaling

| Metric | Action Trigger | What to Do |
|--------|---------------|------------|
| **>50 pickups/day** | Hire 2nd pickup executive | Zone-based routing |
| **>200 pickups/day** | Need driver app | Build React Native driver app with route optimization |
| **>500 pickups/day** | Need warehouse | Lease sorting facility, hire sorting staff |
| **>1000 pickups/day** | Need ops team | Hire ops manager, customer support, city managers |

---

## 5. Competitive Landscape

### Direct Competitors (India — Doorstep Scrap Pickup)

| Company | Cities | Key Features | Strengths | Weaknesses |
|---------|--------|-------------|-----------|------------|
| **The Kabadiwala** | 15+ cities | App-based pickup, rate card, B2B, EPR services | Largest player, strong brand, funded | Generic pricing, slow rural expansion |
| **ScrapQ** | Hyderabad, Ahmedabad | "Circulomony" model, community impact, fair trade | Social impact positioning, loyal community | Limited cities, smaller scale |
| **ScrapUncle** | Delhi NCR, 5+ cities | Shark Tank featured, app-based, corporate tie-ups | Strong media visibility, investor backing | Delhi-focused, aggressive pricing |
| **Raddi Connect / RaddiFinder** | Mumbai, Pune | Simple booking, estimated pricing | Easy UX, regional focus | Limited tech, no admin tools visible |
| **SkrapKart** | Ahmedabad | Doorstep pickup, digital rates | Local competitor | Small scale |

### Indirect Competitors

| Type | Examples | Overlap |
|------|----------|---------|
| **Traditional kabadiwalas** | Local informal scrap dealers | Main alternative; no transparency, inconsistent rates |
| **Apartment waste management** | ITC WOW, Bintix, Saahas Zero Waste | Focus on wet/dry waste; not scrap buying |
| **E-waste specialists** | Attero, EcoBin, Karo Sambhav | Niche e-waste focus; can be partner |
| **B2B scrap marketplaces** | Scrapo, MetalMandi, OfBusiness | B2B industrial; not consumer doorstep |

### Scrapwala's Competitive Edge (Differentiation)

| Advantage | How |
|-----------|-----|
| **Hyper-local Ahmedabad focus** | Deep coverage, faster service, local trust vs national players spreading thin |
| **Transparent live rate card** | Real-time DB-driven rates visible on website (not hidden in app only) |
| **No account required** | Guest-mode booking — zero friction vs competitors requiring app download + signup |
| **Digital scale guarantee** | ISO-certified scales, weigh in front of customer |
| **Instant UPI payment** | Pay on spot, no waiting for bank transfer |
| **Modern tech stack** | Fast website (Next.js SSR), premium UX vs dated competitor apps |
| **B2B + B2C** | Apartment societies + IT parks + individual households |
| **Environmental impact tracking** | ESG metrics on homepage → appeals to conscious consumers |

### SWOT Analysis

| | Positive | Negative |
|---|---------|---------|
| **Internal** | **Strengths:** Modern tech, transparent pricing, guest-mode, Ahmedabad focus, low overhead | **Weaknesses:** No mobile app yet, single-city, no established brand, no funding |
| **External** | **Opportunities:** $14B+ growing market, govt. push (Swachh Bharat, EPR), underserved apartments, ESG corporate demand | **Threats:** Funded competitors expanding, kabadiwala price war, commodity price volatility |

---

## 6. Investor Pitch Deck Outline

### Recommended 12-Slide Structure

| Slide | Content |
|-------|---------|
| **1. Cover** | Scrapwala — "Uber for Scrap Collection" | Tagline, logo, founding team |
| **2. Problem** | ₹1.5L+ Cr scrap traded annually via unorganized kabadiwalas. No transparency, inconsistent pricing, no convenience. 70% of recyclable waste goes to landfill. |
| **3. Solution** | Doorstep scrap pickup with transparent rates, digital scales, instant UPI payment. Web booking (no app install), guest mode. Admin panel for ops management. |
| **4. Market Size** | TAM: India waste management = $14.5B (2026), growing 5–7% CAGR. SAM: Urban residential scrap collection = ~$2B. SOM: Ahmedabad doorstep collection = ~$50M. |
| **5. Traction** | Phase 1 MVP live. X bookings in first month. Y repeat rate. Show booking growth chart. |
| **6. Business Model** | Revenue: Margin on scrap resale (30–60% markup), B2B contracts (offices, societies), future: EPR services. Zero cost to customer. |
| **7. Competitive Advantage** | No-login guest booking, live web rates, Ahmedabad hyper-focus, modern tech (SSR), low CAC via WhatsApp/society partnerships. |
| **8. GTM Strategy** | Phase 1: Apartment WhatsApp + RWA partnerships → Phase 2: Google Ads + B2B → Phase 3: Multi-city expansion. |
| **9. Competition** | 2x2 matrix: (Convenience vs. Transparency). Scrapwala positioned as "High Convenience + High Transparency" vs Kabadiwala (low-low) and Kabadiwala app (med-med). |
| **10. Team** | Founder backgrounds, domain expertise, tech capability. Advisors if any. |
| **11. Financials** | Unit economics (see Section 12). Path to profitability. Runway with/without funding. |
| **12. The Ask** | Raising ₹X for: mobile app development, city expansion (2–3 cities), driver fleet, marketing. 18-month runway target. |

### Key Numbers to Prepare

| Metric | What Investors Want |
|--------|-------------------|
| **Bookings/month** | Growth rate (MoM %) |
| **Repeat rate** | % of customers booking again within 30 days |
| **CAC** | Customer acquisition cost (should be < ₹100 for organic) |
| **LTV** | Lifetime value per customer (avg. bookings × margin per booking) |
| **Gross margin** | Revenue margin on scrap resale (target: 30–50%) |
| **Burn rate** | Monthly operating cost |
| **NPS** | Net Promoter Score from post-pickup surveys |

---

## 7. Business Model & Revenue Streams

### Primary Revenue: Scrap Resale Margin

```
Customer pays: ₹0 (free pickup)
Scrapwala pays customer: ₹X per kg (market rate)
Scrapwala sells to recycler: ₹X + margin per kg

Typical margins by category:
┌─────────────────┬─────────────┬──────────────┬───────────┐
│ Category        │ Buy @ (₹/kg)│ Sell @ (₹/kg)│ Margin %  │
├─────────────────┼─────────────┼──────────────┼───────────┤
│ Newspaper       │ 14–16       │ 18–22        │ 25–40%    │
│ Cardboard       │ 8–10        │ 12–15        │ 40–50%    │
│ Iron/Steel      │ 28–32       │ 38–45        │ 30–40%    │
│ Copper          │ 400–450     │ 520–580      │ 25–30%    │
│ Aluminium       │ 100–120     │ 140–165      │ 30–38%    │
│ Plastic (PET)   │ 10–12       │ 16–20        │ 50–65%    │
│ E-waste         │ 20–30       │ 50–80        │ 60–100%+  │
│ Glass           │ 2–3         │ 5–8          │ 60–100%   │
└─────────────────┴─────────────┴──────────────┴───────────┘
```

### Secondary Revenue Streams (Future)

| Stream | Model | Timeline |
|--------|-------|----------|
| **B2B contracts** | Monthly retainer for offices/societies (₹5K–50K/month) | Phase 2 |
| **EPR compliance services** | Help brands meet Extended Producer Responsibility targets | Phase 3 |
| **Subscription pickups** | Monthly recurring pickup for ₹99/month (guaranteed slot) | Phase 2 |
| **Premium pickups** | Same-day/2-hour window pickup for ₹49 extra | Phase 2 |
| **Data/analytics** | Sell aggregated scrap market data to recyclers/manufacturers | Phase 3 |
| **Advertising** | Rate card page sponsorship by recycling brands | Phase 3 |

---

## 8. Key Metrics & KPIs to Track

### Growth Metrics (Dashboard Priority)

| Metric | Target (Month 3) | Target (Month 6) | Target (Month 12) |
|--------|-------------------|-------------------|---------------------|
| **Monthly bookings** | 200 | 1,000 | 5,000 |
| **DAU (website)** | 100 | 500 | 2,000 |
| **Conversion rate** | 5% | 8% | 12% |
| **Repeat booking rate** | 15% | 25% | 40% |
| **Average order value** | ₹300 | ₹500 | ₹600 |

### Operational Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| **Pickup completion rate** | Completed / Total scheduled | > 90% |
| **Average pickup time** | From arrival to payment | < 20 min |
| **On-time pickup rate** | Within booked time slot | > 85% |
| **Customer satisfaction (NPS)** | Post-pickup survey | > 50 |
| **Cancellation rate** | Cancelled / Total booked | < 10% |
| **Driver utilization** | Pickups per driver per day | 8–12 |

### Financial Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Gross margin** | (Sell price - Buy price) / Sell price | 30–50% |
| **CAC** | Total marketing spend / New customers | < ₹150 |
| **LTV** | Avg. margin × Avg. bookings/year × Avg. years | > ₹1,500 |
| **LTV:CAC ratio** | LTV / CAC | > 3:1 |
| **Burn rate** | Monthly operating costs | Track weekly |
| **Revenue per pickup** | Avg. margin earned per completed pickup | ₹150–300 |

### Analytics Implementation Needed

| Tool | Purpose | Priority |
|------|---------|----------|
| **PostHog / Mixpanel** | Product analytics, funnel tracking, cohort analysis | 🔴 Critical |
| **Google Analytics 4** | Traffic sources, SEO performance, page views | 🔴 Critical |
| **Google Search Console** | SEO ranking, click-through rates, indexing | 🔴 Critical |
| **Hotjar / Clarity** | Heatmaps, session recordings, rage clicks | 🟡 High |
| **Sentry** | Error monitoring, performance tracing | 🟡 High |
| **Vercel Analytics** | Core Web Vitals, server timing | 🟢 Nice-to-have |

---

## 9. Regulatory & Legal Compliance

### Required Licenses & Registrations

| License | Status | Notes |
|---------|--------|-------|
| **GST Registration** | ❓ Required | Mandatory once revenue > ₹20L/year; needed for B2B invoicing |
| **Trade License** | ❓ Required | AMC trade license for scrap dealing in Ahmedabad |
| **MSME / Udyam Registration** | ❓ Recommended | Benefits: Priority lending, lower interest rates, govt. tenders |
| **Shop & Establishment Act** | ❓ Required | Register with Gujarat labor department |
| **PAN for Business** | ❓ Required | Needed for GST and banking |
| **Pollution Control Board NOC** | ❓ May be needed | If operating a warehouse/sorting facility |
| **E-waste authorization** | ❓ If collecting e-waste | CPCB authorization for e-waste handling |

### Data Privacy & Terms

| Document | Status | Action Needed |
|----------|--------|---------------|
| **Privacy Policy** | ✅ Page exists | Review for Indian IT Act 2000 / DPDP Act 2023 compliance |
| **Terms of Service** | ✅ Page exists | Add liability limitations, dispute resolution, payment terms |
| **Cookie consent** | ❌ Missing | Add cookie consent banner (GDPR-lite for India) |
| **Data retention policy** | ❌ Missing | Define how long customer data is stored; auto-purge rules |
| **Data deletion requests** | ❌ Missing | Under DPDP Act 2023, customers can request data deletion |
| **Consent for marketing** | ❌ Missing | Explicit opt-in for WhatsApp/SMS marketing messages |

### Insurance

| Type | Why |
|------|-----|
| **General liability** | Covers damage to customer property during pickup |
| **Vehicle insurance** | For pickup trucks/vehicles |
| **Worker's compensation** | For pickup executives (injuries, accidents) |
| **Cyber insurance** | If handling digital payments / customer data at scale |

---

## 10. Future Roadmap (Phase 2–4)

### Phase 2: Growth & Retention (Month 3–6)

| Feature | Impact | Effort |
|---------|--------|--------|
| **WhatsApp Business API** | Booking confirmations, reminders, status updates | Medium |
| **PWA (Progressive Web App)** | Install on phone, push notifications, offline rates | Medium |
| **Google Maps address** | Autocomplete address input, pin drop location | Low |
| **Photo upload** | Customer uploads scrap photos (bucket ready) | Low |
| **Customer ratings** | Post-pickup star rating + feedback form | Medium |
| **Referral system** | "Share → both get ₹50" viral loop | Medium |
| **Recurring bookings** | Monthly auto-scheduled pickups for societies | Medium |
| **Invoice/receipt PDF** | Auto-generated after completion; email + WhatsApp | Low |
| **Multi-language** | Hindi + Gujarati for broader Ahmedabad reach | Medium |

### Phase 3: Expansion & B2B (Month 6–12)

| Feature | Impact | Effort |
|---------|--------|--------|
| **Mobile app (React Native)** | iOS + Android native app | High |
| **Driver/executive app** | Route optimization, weight entry, payment confirmation | High |
| **Multi-city expansion** | Hyderabad, Chennai, Pune (top scrap markets) | High |
| **B2B dashboard** | Separate portal for corporate clients with reporting | High |
| **EPR compliance module** | Track and report for Extended Producer Responsibility | High |
| **Warehouse management** | Inventory tracking for collected scrap | Medium |
| **Dynamic pricing engine** | AI/ML-based rate adjustment based on market data | Medium |
| **Customer accounts (optional)** | Login for repeat customers; booking history, loyalty points | Medium |
| **Payment gateway** | Razorpay integration for digital payments + reconciliation | Medium |

### Phase 4: Platform & Marketplace (Year 2+)

| Feature | Impact |
|---------|--------|
| **Scrap marketplace** | Connect large sellers directly with recyclers (take commission) |
| **Carbon credit tracking** | Calculate and issue carbon credits per pickup |
| **Smart bins / IoT** | Weight-sensing bins in apartments that auto-trigger pickups |
| **Franchise model** | Enable local entrepreneurs to operate under Scrapwala brand |
| **API for third-party integration** | Let MyGate, NoBroker, society apps embed Scrapwala booking |
| **AI image recognition** | Upload photo → auto-identify scrap type + estimate weight |

---

## 11. Risk Analysis & Mitigation

### Business Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Commodity price crash** | Medium | High | Diversify categories; lock in buyer contracts; maintain thin inventory |
| **Funded competitor enters Ahmedabad** | High | High | Focus on NPS, referral loop, and apartment partnerships (network effects) |
| **Traditional kabadiwala price war** | High | Medium | Compete on convenience + trust, not price alone |
| **Low repeat rate** | Medium | High | WhatsApp reminders, subscription model, loyalty rewards |
| **Pickup executive reliability** | Medium | High | Performance bonuses, GPS tracking, customer ratings per driver |
| **Regulatory changes** | Low | Medium | Stay compliant; join industry associations (e.g., MRAI) |
| **Seasonal demand fluctuation** | Medium | Low | Festive season campaigns (Diwali, New Year), B2B contracts for stability |

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Supabase outage** | Low | High | Implement health checks; have failover plan; cache critical data |
| **Data breach** | Low | Critical | Security hardening (Section 3); pen testing; cyber insurance |
| **DDoS attack** | Low | Medium | Vercel's built-in DDoS protection; Cloudflare as additional layer |
| **Scaling bottleneck** | Medium | Medium | Load test before growth spikes; plan DB scaling (Section 4) |
| **Single point of failure (admin)** | Medium | Medium | Role-based admin access; separate admin accounts |

---

## 12. Unit Economics

### Per-Pickup Economics (Illustrative)

```
Average pickup: 25 kg mixed scrap

Revenue Calculation:
├── 10 kg newspaper    × ₹16/kg buy = ₹160 → sell @ ₹21/kg = ₹210 → margin: ₹50
├── 5 kg cardboard     × ₹9/kg buy  = ₹45  → sell @ ₹14/kg = ₹70  → margin: ₹25
├── 5 kg iron          × ₹30/kg buy = ₹150 → sell @ ₹40/kg = ₹200 → margin: ₹50
├── 3 kg plastic       × ₹11/kg buy = ₹33  → sell @ ₹18/kg = ₹54  → margin: ₹21
└── 2 kg aluminium     × ₹110/kg buy= ₹220 → sell @ ₹150/kg= ₹300 → margin: ₹80
─────────────────────────────────────────────────────────────────────────────────
Total paid to customer:    ₹608
Total sold to recycler:    ₹834
GROSS MARGIN per pickup:   ₹226 (~27%)

Operating Costs per Pickup:
├── Fuel/transport:         ₹40–60
├── Driver wage (prorated): ₹50–80  (assuming 10 pickups/day)
├── Warehouse handling:     ₹10–20
└── Tech/overhead:          ₹10–15
─────────────────────────────────────
Total cost per pickup:      ₹110–175

NET MARGIN per pickup:      ₹50–115
```

### Monthly P&L Projection (at 500 pickups/month)

```
REVENUE
├── Scrap resale margin:     500 × ₹226 = ₹1,13,000
├── B2B contracts (2):       2 × ₹15,000 = ₹30,000
└── Premium pickups (10%):   50 × ₹49 = ₹2,450
                              ─────────────
Total Revenue:                ₹1,45,450

EXPENSES
├── Driver wages (2):         2 × ₹18,000 = ₹36,000
├── Fuel:                     500 × ₹50 = ₹25,000
├── Founder salary:           ₹30,000
├── Tech (Vercel + Supabase): ₹2,500
├── Marketing:                ₹15,000
├── Warehouse rent (shared):  ₹10,000
├── Misc (phone, insurance):  ₹5,000
                              ─────────────
Total Expenses:               ₹1,23,500

NET PROFIT:                   ₹21,950/month
```

### Break-Even Analysis

```
Monthly fixed costs:   ~₹82,500 (wages + rent + tech + founder)
Variable cost/pickup:  ~₹82 (fuel + handling)
Margin/pickup:         ~₹226

Break-even:  ₹82,500 / (₹226 - ₹82) = ~573 pickups/month
             ≈ 19 pickups/day (with 2 drivers)
```

---

## Quick Reference: Competitor Feature Matrix

| Feature | Scrapwala | The Kabadiwala | ScrapQ | ScrapUncle | Traditional |
|---------|-----------|---------------|--------|------------|-------------|
| Doorstep pickup | ✅ | ✅ | ✅ | ✅ | ✅ |
| No login required | ✅ | ❌ (app) | ❌ (app) | ❌ (app) | ✅ |
| Live web rate card | ✅ | Partial | ❌ | Partial | ❌ |
| Digital scale proof | ✅ | ✅ | ✅ | ✅ | ❌ |
| Instant UPI payment | ✅ | ✅ | ✅ | ✅ | Cash only |
| Order tracking | ✅ | ✅ | ✅ | ✅ | ❌ |
| B2B services | ✅ (planned) | ✅ | ✅ | ✅ | ❌ |
| EPR compliance | ❌ (roadmap) | ✅ | ❌ | ❌ | ❌ |
| Mobile app | ❌ (PWA soon) | ✅ | ✅ | ✅ | ❌ |
| Multi-city | ❌ (BLR only) | ✅ (15+) | ✅ (2) | ✅ (5+) | Local |
| Bulk Excel upload | ✅ | ❌ | ❌ | ❌ | ❌ |
| Environmental metrics | ✅ | Partial | ✅ | ❌ | ❌ |
| Referral program | ❌ (planned) | ✅ | ❌ | ✅ | ❌ |
| Modern website (SSR) | ✅ | ❌ (basic) | ❌ | ❌ | ❌ |

---

*Last updated: September 4, 2026*
