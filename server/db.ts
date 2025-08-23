import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "@shared/schema";

// Use Supabase URL from .env file or default
const databaseUrl = process.env.DATABASE_URL || "postgresql://postgres:Nandu%401510%23@db.nkmzdeevzrufwvivqyqc.supabase.co:5432/postgres";

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

const connection = postgres(databaseUrl, { prepare: false });
export const db = drizzle(connection, { schema });