# 🚀 Iron-Mind AI: Deployment Guide (Phase 1)

This guide provides the fastest way to get your app live on your iPhone with a permanent URL.

## 1. The GitHub Bridge
Since we are in a WSL environment, the easiest way to deploy to the cloud is via GitHub.
1. Create a new **Private** repository on GitHub named `iron-mind-ai`.
2. Push the contents of the `/iron-mind` folder to that repo.

## 2. The Vercel Hosting (One-Click)
Vercel is the industry standard for Next.js (the stack we used).
1. Go to [Vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New Project"** and select your `iron-mind-ai` repo.
3. **Crucial:** In the "Environment Variables" section, add your Supabase keys:
   - `NEXT_PUBLIC_SUPABASE_URL` = [Your Supabase URL]
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [Your Supabase Anon Key]
4. Click **Deploy**.

## 3. The iPhone "Native" Setup
Once the build finishes, Vercel will give you a URL (e.g., `iron-mind-ai.vercel.app`).
1. Open that URL in **Safari** on your iPhone.
2. Tap the **Share** icon (square with arrow).
3. Select **"Add to Home Screen"**.

---

## ✅ Why this works
- **Mac-less:** Vercel handles the "build" in the cloud.
- **Auto-Update:** Every time I (or you) update the code in the repo, your phone app updates automatically.
- **SSL/Secure:** You get a real `https://` address for free.
