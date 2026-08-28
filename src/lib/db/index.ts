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

function getLocalSQLiteDb(): D1DatabaseInterface {
  if (localDbInstance) return localDbInstance;

  try {
    // Dynamic require to avoid bundler issues in Edge runtimes
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { DatabaseSync } = require('node:sqlite');
    const dbPath = path.join(process.cwd(), 'data', 'scholarhub.sqlite');

    // Ensure data directory exists
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const sqlite = new DatabaseSync(dbPath);

    // Initialize schema if needed
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
    console.warn('Failed to initialize local SQLite driver:', e);
    // Fallback stub for edge runtimes or unsupported environments
    return {
      prepare() {
        return {
          bind() { return this; },
          async first() { return null; },
          async all() { return { results: [], success: true }; },
          async run() { return { success: true }; },
        };
      },
      async batch() { return []; },
      async exec() { return; },
    };
  }
}

/**
 * Universally retrieves the Cloudflare D1 Database instance.
 * Automatically falls back to local SQLite in development.
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

  // 3. Local Node.js development fallback
  return getLocalSQLiteDb();
}
