# Supabase Setup — MikePrompt

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → Sign up / Log in
2. Click **New project**
3. Choose organization, enter project name (e.g. `mikeprompt`), set a strong database password
4. Select region closest to your users (e.g. EU West for Poland)
5. Click **Create new project** — wait ~2 minutes for provisioning

## 2. Get API keys

In Supabase dashboard → **Settings → API**:

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL (e.g. `https://abcxyz.supabase.co`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `anon` / `public` key
- `SUPABASE_SERVICE_ROLE_KEY` = `service_role` key (keep secret, server-only)

Add these to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]
```

## 3. Run SQL migrations

In Supabase dashboard → **SQL Editor** → paste and run:

```sql
-- User profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  role TEXT,
  industry TEXT,
  usage TEXT,
  challenge TEXT,
  ai_preferred TEXT,
  apps TEXT[],
  ai_level TEXT,
  plan TEXT DEFAULT 'free',
  polishes_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Saved prompts table
CREATE TABLE saved_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  original_prompt TEXT NOT NULL,
  optimized_prompt TEXT NOT NULL,
  selected_chat TEXT,
  selected_product TEXT,
  fixes TEXT[],
  recommendation JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for saved_prompts
ALTER TABLE saved_prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own prompts" ON saved_prompts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own prompts" ON saved_prompts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own prompts" ON saved_prompts FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX saved_prompts_user_id_idx ON saved_prompts(user_id);
CREATE INDEX saved_prompts_created_at_idx ON saved_prompts(created_at DESC);
```

## 4. Configure Auth

In Supabase dashboard → **Authentication → URL Configuration**:

- Site URL: `https://your-domain.com` (or `http://localhost:3000` for local dev)
- Redirect URLs: add `https://your-domain.com/auth/callback` and `http://localhost:3000/auth/callback`

## 5. Enable magic link email

Magic link auth is enabled by default in Supabase. Users receive an email with a login link — no SMTP configuration needed for development (Supabase provides a built-in email service).

For production, configure a custom SMTP in **Settings → Auth → SMTP Settings**.

## App behavior without Supabase

The app works fully without Supabase configured:
- Auth UI is still shown but login will fail gracefully
- Prompt history is saved to `localStorage` (up to 20 entries)
- Profile is saved to `localStorage`

To enable cloud features, simply add the env vars and restart the dev server.
