-- ============================================
-- 001_initial_schema.sql
-- Run this in Supabase SQL Editor
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_used INT DEFAULT 0,
  credits_limit INT DEFAULT 10,  -- Free tier: 10 proposals/day
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job descriptions table
CREATE TABLE job_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  extracted_skills TEXT[],
  word_count INT,
  provider_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Proposals table
CREATE TABLE proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES job_descriptions(id) ON DELETE SET NULL,
  generated_text TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('professional', 'friendly', 'direct')),
  word_count INT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_proposals_user_id ON proposals(user_id);
CREATE INDEX idx_proposals_is_favorite ON proposals(is_favorite);
CREATE INDEX idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- ============================================
-- 002_row_level_security.sql
-- ============================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own job descriptions"
  ON job_descriptions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own proposals"
  ON proposals FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 003_generation_support.sql
-- ============================================

-- Add columns used by backend inserts
ALTER TABLE job_descriptions
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE proposals
  ADD COLUMN IF NOT EXISTS model_used TEXT,
  ADD COLUMN IF NOT EXISTS latency_ms INT,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Grant table permissions for API roles (required for PostgREST operations)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE job_descriptions TO anon, authenticated, service_role;
GRANT ALL ON TABLE proposals TO anon, authenticated, service_role;

-- Credit decrement function (returns true when decremented, false when limit reached)
CREATE OR REPLACE FUNCTION public.decrement_credits(user_id_input UUID)
RETURNS BOOLEAN AS $$
DECLARE
  credits_used_val INT;
  credits_limit_val INT;
BEGIN
  SELECT credits_used, credits_limit
  INTO credits_used_val, credits_limit_val
  FROM public.profiles
  WHERE id = user_id_input
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;

  IF credits_used_val >= credits_limit_val THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
  SET credits_used = credits_used + 1,
      updated_at = NOW()
  WHERE id = user_id_input;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Credit rollback function
CREATE OR REPLACE FUNCTION public.increment_credits(user_id_input UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.profiles
  SET credits_used = GREATEST(credits_used - 1, 0),
      updated_at = NOW()
  WHERE id = user_id_input;

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.decrement_credits(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_credits(UUID) TO anon, authenticated, service_role;
