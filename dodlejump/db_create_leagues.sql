-- Leagues schema for DuoJump
-- Run this in Supabase SQL editor (requires pgcrypto extension)

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Leagues table
CREATE TABLE IF NOT EXISTS public.leagues (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  owner_id text NOT NULL,
  capacity int DEFAULT 50,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leagues_code ON public.leagues(code);

-- Members table
CREATE TABLE IF NOT EXISTS public.league_members (
  league_id uuid REFERENCES public.leagues(id) ON DELETE CASCADE,
  user_id text NOT NULL,
  joined_at timestamptz DEFAULT now(),
  points int DEFAULT 0,
  PRIMARY KEY (league_id, user_id)
);

-- Optional leaderboard view
CREATE OR REPLACE VIEW public.league_leaderboard AS
SELECT lm.league_id, lm.user_id, lm.points, lm.joined_at
FROM public.league_members lm;

-- Enable RLS
ALTER TABLE public.leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.league_members ENABLE ROW LEVEL SECURITY;

-- Policies
-- Allow inserts to leagues only when owner_id = auth.uid()
CREATE POLICY leagues_insert_owner ON public.leagues
  FOR INSERT
  WITH CHECK (auth.uid()::text = owner_id);

-- Allow anyone to select leagues
CREATE POLICY leagues_select ON public.leagues
  FOR SELECT USING (true);

-- Allow users to insert their own membership
CREATE POLICY league_members_insert ON public.league_members
  FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own membership (points)
CREATE POLICY league_members_update_own ON public.league_members
  FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Allow select on members for leaderboard (public)
CREATE POLICY league_members_select ON public.league_members
  FOR SELECT USING (true);

-- End
