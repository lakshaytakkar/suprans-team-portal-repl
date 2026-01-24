import { db } from "../server/db";
import { users } from "../shared/schema";
import bcrypt from "bcryptjs";

async function seedAdmin() {
  // Check if admin exists
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Users already exist, skipping seed");
    process.exit(0);
  }

  const adminPassword = await bcrypt.hash("admin123", 10);
  const salesPassword = await bcrypt.hash("sales123", 10);

  // Create admin user
  await db.insert(users).values({
    name: "Admin User",
    email: "admin@suprans.com",
    password: adminPassword,
    role: "superadmin",
    phone: "+919999999999",
  });

  // Create sales executive
  await db.insert(users).values({
    name: "Sales Executive",
    email: "sales@suprans.com",
    password: salesPassword,
    role: "sales_executive",
    phone: "+919999999998",
  });

  console.log("Admin and sales users created successfully!");
  process.exit(0);
}

seedAdmin().catch(console.error);
