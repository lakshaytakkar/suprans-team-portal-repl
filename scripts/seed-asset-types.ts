import { db } from "../server/db";
import { assets, assetTypes } from "../shared/schema";

async function main() {
  console.log("Seeding asset types...\n");

  // Get current assets to understand categories
  const existingAssets = await db.select().from(assets);
  console.log(`Current assets: ${existingAssets.length}`);
  
  // Get unique categories from existing assets
  const categories = [...new Set(existingAssets.map(a => a.category))];
  console.log("Asset categories:", categories);

  // Check existing asset types
  const existingTypes = await db.select().from(assetTypes);
  console.log(`Current asset types: ${existingTypes.length}`);

  if (existingTypes.length === 0) {
    // Standard asset types based on typical company assets
    const defaultAssetTypes = [
      { name: "Laptop", icon: "Laptop" },
      { name: "Desktop", icon: "Monitor" },
      { name: "Mobile", icon: "Smartphone" },
      { name: "Tablet", icon: "Tablet" },
      { name: "Office Equipment", icon: "Printer" },
      { name: "Furniture", icon: "Armchair" },
      { name: "Vehicle", icon: "Car" },
      { name: "Other", icon: "Package" },
    ];

    for (const at of defaultAssetTypes) {
      await db.insert(assetTypes).values(at);
    }
    console.log(`✓ Inserted ${defaultAssetTypes.length} asset types`);
  } else {
    console.log("Asset types already exist");
  }
  
  // Final count
  const finalTypes = await db.select().from(assetTypes);
  console.log(`\nFinal asset types: ${finalTypes.length}`);
  finalTypes.forEach(t => console.log(`  - ${t.name} (${t.icon})`));
}

main().catch(console.error);
