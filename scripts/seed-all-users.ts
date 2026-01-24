import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

const usersToCreate = [
  { name: "Admin User", email: "admin@suprans.in", role: "superadmin" },
  { name: "Tina", email: "tina@suprans.in", role: "superadmin" },
  { name: "Lakshay Takkar", email: "lakshay@suprans.in", role: "superadmin" },
  { name: "Sanjay", email: "sanjay@suprans.in", role: "sales_executive" },
  { name: "Bharti", email: "bharti@suprans.in", role: "sales_executive" },
  { name: "Love Kumar", email: "love@suprans.in", role: "sales_executive" },
  { name: "Abhinandan", email: "abhinandan@suprans.in", role: "sales_executive" },
  { name: "Akshay", email: "akshay@suprans.in", role: "sales_executive" },
  { name: "Amit", email: "amit@suprans.in", role: "sales_executive" },
  { name: "Garima", email: "garima@suprans.in", role: "sales_executive" },
  { name: "Himanshu", email: "himanshu@suprans.in", role: "sales_executive" },
  { name: "Parthiv", email: "parthiv@suprans.in", role: "sales_executive" },
  { name: "Payal", email: "payal@suprans.in", role: "sales_executive" },
  { name: "Punit", email: "punit@suprans.in", role: "sales_executive" },
  { name: "Sahil Solanki", email: "sahil.solanki@suprans.in", role: "sales_executive" },
  { name: "Simran", email: "simran@suprans.in", role: "sales_executive" },
  { name: "Sumit", email: "sumit@suprans.in", role: "sales_executive" },
  { name: "Sunny", email: "sunny@suprans.in", role: "sales_executive" },
  { name: "Yash", email: "yash@suprans.in", role: "sales_executive" },
  { name: "Rahul Sharma", email: "rahul@suprans.in", role: "sales_executive" },
  { name: "Priya Patel", email: "priya@suprans.in", role: "sales_executive" },
];

async function seedUsers() {
  console.log('Creating user accounts...\n');
  
  const defaultPassword = await bcrypt.hash('suprans123', 10);
  let created = 0;
  let skipped = 0;

  for (const userData of usersToCreate) {
    try {
      const existing = await db.select().from(users).where(eq(users.email, userData.email));
      
      if (existing.length > 0) {
        console.log(`Skipped (exists): ${userData.email}`);
        skipped++;
        continue;
      }

      await db.insert(users).values({
        name: userData.name,
        email: userData.email,
        password: defaultPassword,
        role: userData.role as any,
        phone: '+91' + Math.floor(1000000000 + Math.random() * 9000000000),
      });
      
      console.log(`Created: ${userData.name} (${userData.email})`);
      created++;
    } catch (error: any) {
      console.error(`Error creating ${userData.email}:`, error.message);
    }
  }

  console.log(`\nDone! Created: ${created}, Skipped: ${skipped}`);
  console.log('\nAll users have password: suprans123');
}

seedUsers()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
