-- Subscribers table
CREATE TABLE IF NOT EXISTS subscribers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  language TEXT DEFAULT 'en',
  subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE IF NOT EXISTS admins (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Newsletters table
CREATE TABLE IF NOT EXISTS newsletters (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  status TEXT NOT NULL DEFAULT 'draft',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  sentAt DATETIME
);

-- Monthly stats table
CREATE TABLE IF NOT EXISTS monthly_stats (
  month TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);

-- Create default admin
INSERT OR IGNORE INTO admins (email, password, name) VALUES ('admin@example.com', 'admin123', 'Admin');
