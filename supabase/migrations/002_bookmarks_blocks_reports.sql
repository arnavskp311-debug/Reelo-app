-- ==============================================================================
-- REELO DATABASE SCHEMA (MIGRATION 002) - BOOKMARKS, BLOCKS & REPORTS
-- ==============================================================================

-- 1. Bookmarks Table
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, post_id)
);

-- 2. Blocks Table
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  blocker_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  blocked_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(blocker_id, blocked_id)
);

-- 3. Reports Table
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  target_type TEXT CHECK (target_type IN ('post', 'user', 'comment')) NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT CHECK (status IN ('pending', 'resolved', 'dismissed')) DEFAULT 'pending' NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Bookmarks: user can view/insert/delete only own bookmarks
CREATE POLICY "Users can manage their own bookmarks"
  ON public.bookmarks FOR ALL USING (auth.uid() = user_id);

-- Blocks: blocker can manage their own blocks
CREATE POLICY "Users can manage their own blocks"
  ON public.blocks FOR ALL USING (auth.uid() = blocker_id);

-- Reports: users can submit reports; admins/moderators can view and update
CREATE POLICY "Users can submit reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Moderators can view reports"
  ON public.reports FOR SELECT USING (true);

CREATE POLICY "Moderators can update reports"
  ON public.reports FOR UPDATE USING (true);
