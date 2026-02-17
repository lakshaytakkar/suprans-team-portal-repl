import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from '@shared/schema';

const { Pool } = pg;

const supabaseDbPassword = process.env.SUPABASE_DB_PASSWORD;
const projectRef = 'qqulobridinpfnarkeeu';
const region = 'ap-northeast-2';

const connectionString = supabaseDbPassword
  ? `postgresql://postgres.${projectRef}:${encodeURIComponent(supabaseDbPassword)}@aws-0-${region}.pooler.supabase.com:5432/postgres`
  : process.env.DATABASE_URL!;

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
