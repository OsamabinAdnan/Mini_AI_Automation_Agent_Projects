-- ============================================
-- RESET APP TABLES (safe for auth.users)
-- This script DROPS and RECREATES only app tables:
--   profiles, job_descriptions, proposals
-- It does NOT delete Supabase auth.users.
-- ============================================

BEGIN;

-- 1) Remove trigger/function that depends on profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 2) Drop app tables (child -> parent)
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS job_descriptions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 3) Ensure extension exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 4) Recreate tables
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits_used INT DEFAULT 0,
  credits_limit INT DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.job_descriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  extracted_skills TEXT[],
  word_count INT,
  provider_used TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.proposals (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.job_descriptions(id) ON DELETE SET NULL,
  generated_text TEXT NOT NULL,
  tone TEXT CHECK (tone IN ('professional', 'friendly', 'direct')),
  word_count INT,
  is_favorite BOOLEAN DEFAULT FALSE,
  model_used TEXT,
  latency_ms INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5) Indexes
CREATE INDEX idx_proposals_user_id ON public.proposals(user_id);
CREATE INDEX idx_proposals_is_favorite ON public.proposals(is_favorite);
CREATE INDEX idx_job_descriptions_user_id ON public.job_descriptions(user_id);
CREATE INDEX idx_proposals_created_at ON public.proposals(created_at DESC);

-- 6) Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_descriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 7) Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can CRUD own job descriptions"
  ON public.job_descriptions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD own proposals"
  ON public.proposals FOR ALL
  USING (auth.uid() = user_id);

-- 8) Recreate profile auto-create trigger (with error handling)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the signup
  RAISE NOTICE 'Error creating profile: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9) RPC functions
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

-- 10) Grants
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.profiles TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.job_descriptions TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.proposals TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.decrement_credits(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.increment_credits(UUID) TO anon, authenticated, service_role;

COMMIT;
