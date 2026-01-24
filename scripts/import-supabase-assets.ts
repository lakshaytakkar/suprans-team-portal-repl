import { db } from "../server/db";
import { assets, assetTypes } from "../shared/schema";
import { eq, sql } from "drizzle-orm";

// Supabase config
const SUPABASE_URL = "https://hbtugjzbncvxyetcktbl.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhidHVnanpibmN2eHlldGNrdGJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkwNzIxMjAsImV4cCI6MjA0NDY0ODEyMH0.DaSnFz1BYtLMSqfZGjNVZ0V1IYpfnMGmgVgj_aJyDyE";

async function fetchFromSupabase(table: string) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${table}: ${res.status}`);
  }
  return res.json();
}

async function main() {
  console.log("Starting Supabase data import...\n");

  // 1. Import asset_types
  console.log("Fetching asset_types from Supabase...");
  const supabaseAssetTypes = await fetchFromSupabase("asset_types");
  console.log(`Found ${supabaseAssetTypes.length} asset types`);

  // Check existing
  const existingTypes = await db.select().from(assetTypes);
  console.log(`Current asset_types in DB: ${existingTypes.length}`);

  if (existingTypes.length === 0) {
    for (const at of supabaseAssetTypes) {
      await db.insert(assetTypes).values({
        id: at.id,
        name: at.name,
        icon: at.icon,
      });
    }
    console.log(`✓ Inserted ${supabaseAssetTypes.length} asset types`);
  } else {
    console.log("Asset types already exist, skipping...");
  }

  // 2. Fetch assets
  console.log("\nFetching assets from Supabase...");
  const supabaseAssets = await fetchFromSupabase("assets");
  console.log(`Found ${supabaseAssets.length} assets`);

  const existingAssets = await db.select().from(assets);
  console.log(`Current assets in DB: ${existingAssets.length}`);

  // Print sample asset to understand structure
  if (supabaseAssets.length > 0) {
    console.log("\nSample Supabase asset structure:");
    console.log(JSON.stringify(supabaseAssets[0], null, 2));
  }

  console.log("\n✓ Import analysis complete");
}

main().catch(console.error);
