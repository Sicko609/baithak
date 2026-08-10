# বৈঠক (Baithak)

A deshi-themed social app for Bangladeshi restaurants and adda hangouts — Next.js + Tailwind CSS + Supabase (auth, database).

Real accounts, real restaurants, real reviews — not just a landing page.

## What's included

- **Sign up / Log in** (Supabase Auth, email + password)
- **Explore restaurants** — browse + add new spots
- **Reviews** — Taste, Adda Vibe, and Price (Sosta/Motamuti/Dam) per restaurant
- Database schema for `profiles`, `restaurants`, `reviews`, and `adda_sessions` (scheduler included in the schema — UI for it is a natural next step)

## 1. Set up Supabase (free)

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once it's created, open **SQL Editor** → New query → paste the contents of `supabase/schema.sql` → Run.
   This creates all four tables, an auto-profile trigger, and row-level security policies.
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.

## 2. Configure the app locally

```bash
cp .env.local.example .env.local
```

Paste your Project URL and anon key into `.env.local`.

```bash
npm install
npm run dev
```

Open http://localhost:3000 — sign up, add a restaurant, leave a review.

## 3. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Baithak with Supabase auth + reviews"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/baithak.git
git push -u origin main
```

## 4. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → sign in with GitHub → Add New → Project → select `baithak`.
2. Before deploying, open **Environment Variables** and add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   (same values as your `.env.local`)
3. Click **Deploy**. You'll get a live URL like `baithak.vercel.app`.
4. Every future `git push` to `main` auto-redeploys.

## Project structure

```
baithak/
├── app/
│   ├── layout.js              # root layout + NavBar
│   ├── page.js                 # marketing homepage
│   ├── login/page.js
│   ├── signup/page.js
│   ├── restaurants/page.js     # browse + add restaurants
│   └── restaurants/[id]/page.js  # restaurant detail + reviews
├── components/
│   └── NavBar.js               # auth-aware nav bar
├── lib/
│   └── supabaseClient.js
├── supabase/
│   └── schema.sql              # run this in Supabase's SQL editor
├── .env.local.example
└── tailwind.config.js          # deshi color palette
```

## Next build steps

- **Adda scheduler UI** — the `adda_sessions` table already exists; build a form on the restaurant page to propose a meetup time and invite friends.
- **Badges** — award `Kacchi Khadok` / `Cha-Khor` etc. based on review counts by category (a Supabase Edge Function or a scheduled job works well here).
- **Leaderboard page** — rank restaurants by average taste score, rank users by review count/streak.
- **Profile page** — let users edit their `display_name` and `username`.
