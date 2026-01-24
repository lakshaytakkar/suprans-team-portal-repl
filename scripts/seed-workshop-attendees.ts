import { db } from '../server/db';
import { eventAttendees } from '../shared/schema';
import * as fs from 'fs';

const EVENT_ID = '40342823-d377-4ba4-9715-587b4d903dea'; // Feb 1 Delhi Seminar

function generateAvatar(name: string): string {
  const encodedName = encodeURIComponent(name.trim());
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodedName}&backgroundColor=f34147,1e88e5,43a047,fb8c00,8e24aa,e53935&backgroundType=solid`;
}

async function seedAttendees() {
  const csvPath = 'attached_assets/Workshop__VIP_Data_-_Delhi_Workshops_1769149778880.csv';
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header
  
  const attendeesMap = new Map<string, { name: string; phone: string; email: string }>();
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    const parts = line.split(',');
    if (parts.length < 4) continue;
    
    const name = parts[1]?.trim() || '';
    const phone = parts[2]?.trim() || '';
    const email = parts[3]?.trim() || '';
    
    if (!name || !phone) continue;
    
    const key = `${name.toLowerCase()}-${phone}`;
    if (!attendeesMap.has(key)) {
      attendeesMap.set(key, { name, phone, email });
    }
  }
  
  console.log(`Found ${attendeesMap.size} unique attendees`);
  
  const attendeesToInsert = Array.from(attendeesMap.values()).map(a => ({
    eventId: EVENT_ID,
    name: a.name,
    phone: a.phone,
    email: a.email || null,
    avatar: generateAvatar(a.name),
    source: 'direct',
    ticketStatus: 'pending',
    badgePrinted: false,
    checkedIn: false,
  }));
  
  // Insert in batches of 50
  const batchSize = 50;
  let inserted = 0;
  
  for (let i = 0; i < attendeesToInsert.length; i += batchSize) {
    const batch = attendeesToInsert.slice(i, i + batchSize);
    await db.insert(eventAttendees).values(batch);
    inserted += batch.length;
    console.log(`Inserted ${inserted}/${attendeesToInsert.length} attendees`);
  }
  
  console.log('Done seeding workshop attendees!');
  process.exit(0);
}

seedAttendees().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
