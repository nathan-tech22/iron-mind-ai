# 🛠️ Iron-Mind AI: Phase 1 Technical Specification

## Project Overview
Transitioning the "Iron 5/3/1" tracker from a local React Native prototype to a scalable, production-ready SaaS platform called **Iron-Mind AI**.

## 🏗️ The "Founder Stack"
- **Frontend/Backend:** Next.js (App Router)
- **Database & Auth:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS + Shadcn UI
- **Payments:** Stripe
- **Hosting:** Vercel

## 🗄️ Database Schema
### `profiles`
- `id`: uuid (primary key)
- `email`: string
- `subscription_status`: enum (free, pro)
- `last_synced`: timestamp

### `lifts`
- `id`: uuid
- `user_id`: uuid (foreign key)
- `name`: string (Squat, Bench, etc.)
- `true_1rm`: float
- `training_max_pct`: float (default 0.9)

### `workouts`
- `id`: uuid
- `user_id`: uuid
- `lift_id`: uuid
- `date`: timestamp
- `reps_completed`: int
- `weight_used`: float
- `estimated_1rm`: float

## 🚀 Implementation Roadmap
1. **Initialize Next.js Project:** Set up the directory structure with Tailwind and TypeScript.
2. **Supabase Integration:** Configure environment variables and basic Auth hooks.
3. **Component Porting:** Move the "Visual Barbell" and "5/3/1 Logic" from React Native to React (Next.js).
4. **Deployment:** Push to GitHub and link to Vercel.
