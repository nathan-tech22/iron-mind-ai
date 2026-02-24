-- IRON-MIND AI: PRODUCTION SCHEMA
-- Run this in the Supabase SQL Editor

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  subscription_status TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Lifts Table (Training Maxes)
CREATE TABLE IF NOT EXISTS public.lifts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- SQUAT, BENCH, DEADLIFT, PRESS
  training_max NUMERIC NOT NULL,
  increment_lbs NUMERIC DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workouts Table (Session History)
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lift_id UUID REFERENCES public.lifts ON DELETE CASCADE NOT NULL,
  weight_lbs NUMERIC NOT NULL,
  reps_completed INTEGER NOT NULL,
  estimated_1rm NUMERIC,
  workout_date TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

-- Create Policies (Users can only see their own data)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can manage own lifts" ON public.lifts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own workouts" ON public.workouts FOR ALL USING (auth.uid() = user_id);
