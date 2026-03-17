-- 00_schema.sql
-- Create custom types and tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. USERS
-- ==========================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email)
  VALUES (new.id, new.raw_user_meta_data->>'name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Users can read their own profile, or profiles of users in their houses
CREATE POLICY "Users can read their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- ==========================================
-- 2. HOUSES & MEMBERS
-- ==========================================
CREATE TABLE public.houses (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.house_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id TEXT REFERENCES public.houses(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')),
  status TEXT CHECK (status IN ('pending', 'active')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(house_id, user_id)
);

ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.house_members ENABLE ROW LEVEL SECURITY;

-- RLS: Houses
CREATE POLICY "Members can view their houses" ON public.houses
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.house_members WHERE house_id = public.houses.id AND user_id = auth.uid())
  );
  
CREATE POLICY "Anyone can create a house" ON public.houses
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- RLS: House Members
CREATE POLICY "Members can view members of their houses" ON public.house_members
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.house_members hm WHERE hm.house_id = public.house_members.house_id AND hm.user_id = auth.uid())
  );

-- ==========================================
-- 3. EXPENSES
-- ==========================================
CREATE TABLE public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id TEXT REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payer_id UUID REFERENCES public.users(id),
  participant_ids JSONB NOT NULL DEFAULT '[]',
  date TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can CRUD expenses in their house" ON public.expenses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.house_members WHERE house_id = public.expenses.house_id AND user_id = auth.uid() AND status = 'active')
  );

-- ==========================================
-- 4. TASKS
-- ==========================================
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id TEXT REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  assignee UUID REFERENCES public.users(id),
  due_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('pending', 'completed')),
  category TEXT,
  recurrence TEXT
);

ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can CRUD tasks in their house" ON public.tasks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.house_members WHERE house_id = public.tasks.house_id AND user_id = auth.uid() AND status = 'active')
  );

-- ==========================================
-- 5. SHOPPING SECTIONS & ITEMS
-- ==========================================
CREATE TABLE public.shopping_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id TEXT REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  emoji TEXT,
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.shopping_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES public.shopping_sections(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  estimated_price NUMERIC,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by UUID REFERENCES public.users(id),
  added_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.shopping_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can CRUD shopping sections in their house" ON public.shopping_sections
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.house_members WHERE house_id = public.shopping_sections.house_id AND user_id = auth.uid() AND status = 'active')
  );

CREATE POLICY "Members can CRUD shopping items in their house" ON public.shopping_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.shopping_sections s JOIN public.house_members hm ON hm.house_id = s.house_id WHERE s.id = public.shopping_items.section_id AND hm.user_id = auth.uid() AND hm.status = 'active')
  );

-- ==========================================
-- 6. CHAT & POLLS
-- ==========================================
CREATE TABLE public.chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  house_id TEXT REFERENCES public.houses(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.users(id),
  type TEXT CHECK (type IN ('text', 'poll')),
  content TEXT, -- Texto del mensaje
  poll_data JSONB, -- Estructura de encuesta { question, options, votes }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Members can CRUD chat messages in their house" ON public.chat_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.house_members WHERE house_id = public.chat_messages.house_id AND user_id = auth.uid() AND status = 'active')
  );
