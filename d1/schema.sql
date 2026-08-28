-- ==============================================================================
-- ScholarHub Cloudflare D1 Database Schema
-- Run with: npx wrangler d1 execute scholarhub-db --file=d1/schema.sql
-- ==============================================================================

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);


-- 2. User Sessions Table (Edge Auth Session Storage)
CREATE TABLE IF NOT EXISTS sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions (user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at);


-- 3. Magic Link Tokens Table
CREATE TABLE IF NOT EXISTS magic_links (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  next_path TEXT DEFAULT '/shortlist',
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_magic_links_email ON magic_links (email);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links (expires_at);


-- 4. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT UNIQUE,
  bio TEXT,
  location TEXT,
  website_url TEXT,
  avatar_url TEXT,
  quiz_answers TEXT, -- JSON serialized string
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles (username);


-- 5. Shortlists Table
CREATE TABLE IF NOT EXISTS shortlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_slug TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, scholarship_slug)
);

CREATE INDEX IF NOT EXISTS idx_shortlists_user ON shortlists (user_id);


-- 6. Scholarship Applications & Kanban Tracker Table
CREATE TABLE IF NOT EXISTS scholarship_applications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  scholarship_slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'shortlisted' CHECK (
    status IN ('shortlisted', 'preparing', 'applied', 'interviewing', 'accepted', 'rejected')
  ),
  notes TEXT,
  checklist TEXT DEFAULT '[]', -- JSON serialized string
  target_deadline TEXT,
  announcement_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, scholarship_slug)
);

CREATE INDEX IF NOT EXISTS idx_applications_user_status ON scholarship_applications (user_id, status);
