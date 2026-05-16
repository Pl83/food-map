# FoodMap

A restaurant discovery app built with SvelteKit and Supabase. Browse restaurants on an interactive map, filter by cuisine and price, and leave comments.

## Features

- Interactive map (Leaflet.js) with restaurant pins
- Add restaurants by address — geocoded automatically via Nominatim
- Filter by cuisine tag and price level
- Walking time estimates via OSRM
- Like/dislike comments per restaurant
- Auth with per-user ownership and row-level security

## Stack

- **SvelteKit 2** with Svelte 5 runes
- **Supabase** — PostgreSQL + Auth + RLS
- **Tailwind CSS v4**
- **Leaflet.js** for the map (client-side only)
- **Vercel** deployment via `@sveltejs/adapter-vercel`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your Supabase project credentials:

```bash
cp .env.example .env
```

```env
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Find these in your Supabase dashboard under **Project Settings → API**.

### 3. Create the database tables

In the Supabase dashboard, go to **SQL Editor → New query**, paste the contents of `schema.sql`, and run it.

This creates the `profiles`, `restaurants`, `food_tags`, `restaurant_tags`, and `comments` tables along with RLS policies and indexes.

### 4. Run locally

```bash
npm run dev
```

## Deployment

Push to a Vercel-connected repo and add the three environment variables from `.env` to your Vercel project settings.
