import path from 'path';
import fs from 'fs';

export interface D1PreparedStatement {
  bind(...values: any[]): D1PreparedStatement;
  first<T = Record<string, any>>(colName?: string): Promise<T | null>;
  all<T = Record<string, any>>(): Promise<{ results: T[]; success: boolean }>;
  run(): Promise<{ success: boolean; meta?: any }>;
}

export interface D1DatabaseInterface {
  prepare(query: string): D1PreparedStatement;
  batch(statements: D1PreparedStatement[]): Promise<any[]>;
  exec(query: string): Promise<any>;
}

let localDbInstance: D1DatabaseInterface | null = null;

interface LocalDataStore {
  users: Array<{ id: string; email: string; created_at: string }>;
  sessions: Array<{ id: string; user_id: string; expires_at: string; created_at: string }>;
  magic_links: Array<{ token: string; email: string; next_path: string; expires_at: string; created_at: string }>;
  profiles: Array<{ user_id: string; display_name?: string | null; username?: string | null; bio?: string | null; location?: string | null; website_url?: string | null; avatar_url?: string | null; quiz_answers?: string | null; created_at?: string; updated_at?: string }>;
  shortlists: Array<{ id: string; user_id: string; scholarship_slug: string; created_at: string }>;
  scholarship_applications: Array<{ id: string; user_id: string; scholarship_slug: string; status: string; notes?: string; checklist?: string; target_deadline?: string; announcement_date?: string; created_at: string; updated_at: string }>;
}

const dbFilePath = path.join(process.cwd(), 'data', 'local_db.json');

function getStore(): LocalDataStore {
  const dir = path.dirname(dbFilePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(dbFilePath)) {
    const init: LocalDataStore = {
      users: [],
      sessions: [],
      magic_links: [],
      profiles: [],
      shortlists: [],
      scholarship_applications: [],
    };
    fs.writeFileSync(dbFilePath, JSON.stringify(init, null, 2), 'utf8');
    return init;
  }
  try {
    return JSON.parse(fs.readFileSync(dbFilePath, 'utf8'));
  } catch {
    return {
      users: [],
      sessions: [],
      magic_links: [],
      profiles: [],
      shortlists: [],
      scholarship_applications: [],
    };
  }
}

function saveStore(store: LocalDataStore): void {
  fs.writeFileSync(dbFilePath, JSON.stringify(store, null, 2), 'utf8');
}

function executeQuery(query: string, params: any[]): any[] {
  const store = getStore();

  // 1. Magic link lookup
  if (query.includes('FROM magic_links WHERE token = ?')) {
    const [token, nowIso] = params;
    const link = (store.magic_links || []).find(
      (m) => m.token === token && (!nowIso || m.expires_at > nowIso)
    );
    return link ? [link] : [];
  }

  // 2. Session lookup with user join
  if (query.includes('FROM sessions') && query.includes('JOIN users')) {
    const [sessionId, nowIso] = params;
    const session = (store.sessions || []).find(
      (s) => s.id === sessionId && (!nowIso || s.expires_at > nowIso)
    );
    if (!session) return [];
    const user = (store.users || []).find((u) => u.id === session.user_id);
    if (!user) return [];
    return [{ id: user.id, email: user.email, created_at: user.created_at }];
  }

  // 3. User lookup by email
  if (query.includes('FROM users WHERE email = ?')) {
    const [email] = params;
    const user = (store.users || []).find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    return user ? [user] : [];
  }

  // 4. User lookup by ID
  if (query.includes('FROM users WHERE id = ?')) {
    const [id] = params;
    const user = (store.users || []).find((u) => u.id === id);
    return user ? [user] : [];
  }

  // 5. Profile lookup
  if (query.includes('FROM profiles WHERE user_id = ?')) {
    const [userId] = params;
    const profile = (store.profiles || []).find((p) => p.user_id === userId);
    return profile ? [profile] : [];
  }

  // 6. Username conflict lookup
  if (query.includes('FROM profiles WHERE username = ? AND user_id != ?')) {
    const [username, userId] = params;
    const conflict = (store.profiles || []).find(
      (p) => p.username?.toLowerCase() === String(username).toLowerCase() && p.user_id !== userId
    );
    return conflict ? [{ user_id: conflict.user_id }] : [];
  }

  // 7. Applications lookup
  if (query.includes('FROM scholarship_applications WHERE user_id = ?')) {
    const [userId, slug] = params;
    let apps = (store.scholarship_applications || []).filter((a) => a.user_id === userId);
    if (query.includes('scholarship_slug = ?') && slug) {
      apps = apps.filter((a) => a.scholarship_slug === slug);
    }
    return apps;
  }

  // 8. Shortlists lookup
  if (query.includes('FROM shortlists WHERE user_id = ?')) {
    const [userId] = params;
    return (store.shortlists || []).filter((s) => s.user_id === userId);
  }

  return [];
}

function executeMutation(query: string, params: any[]): { changes: number } {
  const store = getStore();

  // 1. INSERT magic link
  if (query.includes('INSERT INTO magic_links')) {
    const [token, email, next_path, expires_at] = params;
    store.magic_links = store.magic_links || [];
    store.magic_links.push({
      token,
      email,
      next_path: next_path || '/shortlist',
      expires_at,
      created_at: new Date().toISOString(),
    });
    saveStore(store);
    return { changes: 1 };
  }

  // 2. DELETE magic link
  if (query.includes('DELETE FROM magic_links WHERE token = ?')) {
    const [token] = params;
    store.magic_links = (store.magic_links || []).filter((m) => m.token !== token);
    saveStore(store);
    return { changes: 1 };
  }

  // 3. INSERT user
  if (query.includes('INSERT INTO users')) {
    const [id, email] = params;
    store.users = store.users || [];
    const exists = store.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (!exists) {
      store.users.push({ id, email, created_at: new Date().toISOString() });
    }
    saveStore(store);
    return { changes: 1 };
  }

  // 4. INSERT / UPDATE profile
  if (query.includes('INSERT INTO profiles')) {
    store.profiles = store.profiles || [];
    if (query.includes('quiz_answers')) {
      const [user_id, jsonStr, nowIso] = params;
      const idx = store.profiles.findIndex((p) => p.user_id === user_id);
      if (idx >= 0) {
        store.profiles[idx].quiz_answers = jsonStr;
        store.profiles[idx].updated_at = nowIso;
      } else {
        store.profiles.push({
          user_id,
          quiz_answers: jsonStr,
          created_at: nowIso,
          updated_at: nowIso,
        });
      }
    } else if (params.length >= 8) {
      const [user_id, display_name, username, bio, location, website_url, avatar_url, updated_at] = params;
      const idx = store.profiles.findIndex((p) => p.user_id === user_id);
      const item = {
        user_id,
        display_name,
        username,
        bio,
        location,
        website_url,
        avatar_url,
        updated_at,
        created_at: idx >= 0 ? (store.profiles[idx].created_at || new Date().toISOString()) : new Date().toISOString(),
        quiz_answers: idx >= 0 ? (store.profiles[idx].quiz_answers || null) : null,
      };
      if (idx >= 0) {
        store.profiles[idx] = item;
      } else {
        store.profiles.push(item);
      }
    } else {
      const [user_id, display_name] = params;
      const exists = store.profiles.find((p) => p.user_id === user_id);
      if (!exists) {
        store.profiles.push({
          user_id,
          display_name: display_name || 'Scholar',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    }
    saveStore(store);
    return { changes: 1 };
  }

  // 5. INSERT session
  if (query.includes('INSERT INTO sessions')) {
    const [id, user_id, expires_at] = params;
    store.sessions = store.sessions || [];
    store.sessions.push({ id, user_id, expires_at, created_at: new Date().toISOString() });
    saveStore(store);
    return { changes: 1 };
  }

  // 6. DELETE session
  if (query.includes('DELETE FROM sessions WHERE id = ?')) {
    const [id] = params;
    store.sessions = (store.sessions || []).filter((s) => s.id !== id);
    saveStore(store);
    return { changes: 1 };
  }

  // 7. Applications mutations
  if (
    query.includes('INSERT INTO scholarship_applications') ||
    query.includes('INSERT OR REPLACE INTO scholarship_applications')
  ) {
    const [id, user_id, scholarship_slug, status] = params;
    store.scholarship_applications = store.scholarship_applications || [];
    const idx = store.scholarship_applications.findIndex(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    const item = {
      id: id || crypto.randomUUID(),
      user_id,
      scholarship_slug,
      status: status || 'shortlisted',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    if (idx >= 0) {
      store.scholarship_applications[idx] = { ...store.scholarship_applications[idx], ...item };
    } else {
      store.scholarship_applications.push(item);
    }
    saveStore(store);
    return { changes: 1 };
  }

  if (query.includes('DELETE FROM scholarship_applications WHERE user_id = ? AND scholarship_slug = ?')) {
    const [user_id, scholarship_slug] = params;
    store.scholarship_applications = (store.scholarship_applications || []).filter(
      (a) => !(a.user_id === user_id && a.scholarship_slug === scholarship_slug)
    );
    saveStore(store);
    return { changes: 1 };
  }

  if (query.includes('UPDATE scholarship_applications SET status = ?')) {
    const [status, updated_at, user_id, scholarship_slug] = params;
    const app = (store.scholarship_applications || []).find(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    if (app) {
      app.status = status;
      app.updated_at = updated_at || new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  if (query.includes('UPDATE scholarship_applications SET notes = ?')) {
    const [notes, updated_at, user_id, scholarship_slug] = params;
    const app = (store.scholarship_applications || []).find(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    if (app) {
      app.notes = notes;
      app.updated_at = updated_at || new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  if (query.includes('UPDATE scholarship_applications SET checklist = ?')) {
    const [checklist, updated_at, user_id, scholarship_slug] = params;
    const app = (store.scholarship_applications || []).find(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    if (app) {
      app.checklist = checklist;
      app.updated_at = updated_at || new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  if (query.includes('UPDATE scholarship_applications SET target_deadline = ?')) {
    const [target_deadline, updated_at, user_id, scholarship_slug] = params;
    const app = (store.scholarship_applications || []).find(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    if (app) {
      app.target_deadline = target_deadline;
      app.updated_at = updated_at || new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  if (query.includes('UPDATE scholarship_applications SET announcement_date = ?')) {
    const [announcement_date, updated_at, user_id, scholarship_slug] = params;
    const app = (store.scholarship_applications || []).find(
      (a) => a.user_id === user_id && a.scholarship_slug === scholarship_slug
    );
    if (app) {
      app.announcement_date = announcement_date;
      app.updated_at = updated_at || new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  // Profile update
  if (query.includes('UPDATE profiles SET')) {
    const user_id = params[params.length - 1];
    const profile = (store.profiles || []).find((p) => p.user_id === user_id);
    if (profile) {
      if (query.includes('display_name = ?')) profile.display_name = params[0];
      if (query.includes('username = ?')) profile.username = params[1];
      if (query.includes('bio = ?')) profile.bio = params[2];
      if (query.includes('location = ?')) profile.location = params[3];
      if (query.includes('website_url = ?')) profile.website_url = params[4];
      if (query.includes('avatar_url = ?')) profile.avatar_url = params[5];
      if (query.includes('quiz_answers = ?')) profile.quiz_answers = params[0];
      profile.updated_at = new Date().toISOString();
      saveStore(store);
    }
    return { changes: 1 };
  }

  return { changes: 0 };
}

function getJsonDbAdapter(): D1DatabaseInterface {
  return {
    prepare(rawQuery: string) {
      let boundParams: any[] = [];
      const query = rawQuery.replace(/\s+/g, ' ').trim();

      const stmtObj: D1PreparedStatement = {
        bind(...values: any[]) {
          boundParams = values;
          return stmtObj;
        },
        async first<T = Record<string, any>>(colName?: string): Promise<T | null> {
          const rows = executeQuery(query, boundParams);
          if (!rows || rows.length === 0) return null;
          const row = rows[0];
          if (colName && typeof row === 'object') {
            return (row[colName] ?? null) as T;
          }
          return row as T;
        },
        async all<T = Record<string, any>>(): Promise<{ results: T[]; success: boolean }> {
          const rows = executeQuery(query, boundParams);
          return { results: (rows || []) as T[], success: true };
        },
        async run(): Promise<{ success: boolean; meta?: any }> {
          const result = executeMutation(query, boundParams);
          return { success: true, meta: result };
        },
      };

      return stmtObj;
    },
    async batch(statements: D1PreparedStatement[]) {
      const results = [];
      for (const s of statements) {
        results.push(await s.run());
      }
      return results;
    },
    async exec() {
      return;
    },
  };
}

function getLocalSQLiteDb(): D1DatabaseInterface {
  if (localDbInstance) return localDbInstance;

  try {
    // Dynamic require to avoid bundler issues in Edge runtimes
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.join(process.cwd(), 'data', 'scholarhub.sqlite');

    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqlite = new DatabaseSync(dbPath);

    const schemaPath = path.join(process.cwd(), 'd1', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      sqlite.exec(schemaSql);
    }

    const adapter: D1DatabaseInterface = {
      prepare(query: string) {
        let boundParams: any[] = [];

        const stmtObj: D1PreparedStatement = {
          bind(...values: any[]) {
            boundParams = values;
            return stmtObj;
          },
          async first<T = Record<string, any>>(colName?: string): Promise<T | null> {
            try {
              const stmt = sqlite.prepare(query);
              const row = stmt.get(...boundParams) as any;
              if (!row) return null;
              if (colName && typeof row === 'object') {
                return (row[colName] ?? null) as T;
              }
              return row as T;
            } catch (err) {
              console.error('Local SQLite Query Error (first):', err, { query, boundParams });
              throw err;
            }
          },
          async all<T = Record<string, any>>(): Promise<{ results: T[]; success: boolean }> {
            try {
              const stmt = sqlite.prepare(query);
              const rows = stmt.all(...boundParams) as T[];
              return { results: rows || [], success: true };
            } catch (err) {
              console.error('Local SQLite Query Error (all):', err, { query, boundParams });
              throw err;
            }
          },
          async run(): Promise<{ success: boolean; meta?: any }> {
            try {
              const stmt = sqlite.prepare(query);
              const result = stmt.run(...boundParams);
              return { success: true, meta: result };
            } catch (err) {
              console.error('Local SQLite Query Error (run):', err, { query, boundParams });
              throw err;
            }
          },
        };

        return stmtObj;
      },
      async batch(statements: D1PreparedStatement[]) {
        const results = [];
        for (const s of statements) {
          results.push(await s.run());
        }
        return results;
      },
      async exec(query: string) {
        return sqlite.exec(query);
      },
    };

    localDbInstance = adapter;
    return adapter;
  } catch (e) {
    console.info('Using JSON file-based database for local development fallback.');
    localDbInstance = getJsonDbAdapter();
    return localDbInstance;
  }
}

/**
 * Universally retrieves the Cloudflare D1 Database instance.
 * Automatically falls back to local SQLite/JSON storage in development.
 */
export function getDb(): D1DatabaseInterface {
  // 1. Cloudflare Pages / Workers global D1 binding
  const globalEnv = (globalThis as any).env || (globalThis as any).__env__ || (process.env as any);
  if (globalEnv?.DB && typeof globalEnv.DB.prepare === 'function') {
    return globalEnv.DB as D1DatabaseInterface;
  }

  // 2. Direct global DB binding (in Cloudflare Workers)
  if ((globalThis as any).DB && typeof (globalThis as any).DB.prepare === 'function') {
    return (globalThis as any).DB as D1DatabaseInterface;
  }

  // 3. Local Node.js development fallback (SQLite or JSON file)
  return getLocalSQLiteDb();
}
