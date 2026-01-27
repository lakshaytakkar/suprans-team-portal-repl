import { db } from './db';
import { eventAttendees } from '../shared/schema';
import { eq, sql } from 'drizzle-orm';
import * as fs from 'fs';

const EVENT_ID = '40342823-d377-4ba4-9715-587b4d903dea';

interface CsvRow {
  name: string;
  phone: string;
  email: string;
}

async function syncAttendees() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync('attached_assets/Workshop__VIP_Data_-_Delhi_Workshops_(2)_1769498210045.csv', 'utf-8');
  const lines = csvContent.trim().split('\n');
  
  const attendeesMap = new Map<string, { name: string; phone: string; email: string; count: number }>();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const parts = line.split(',');
    if (parts.length >= 4) {
      const name = parts[1].trim();
      const phone = parts[2].trim().replace(/^\+/, '');
      const email = parts[3].trim().toLowerCase().replace(/^"|"$/g, '');
      
      const key = `${name.toLowerCase()}|${phone}|${email}`;
      
      if (attendeesMap.has(key)) {
        attendeesMap.get(key)!.count++;
      } else {
        attendeesMap.set(key, { name, phone, email, count: 1 });
      }
    }
  }
  
  console.log(`Found ${lines.length - 1} total tickets for ${attendeesMap.size} unique attendees`);
  
  console.log('Deleting existing attendees for this event...');
  await db.delete(eventAttendees).where(eq(eventAttendees.eventId, EVENT_ID));
  
  console.log('Inserting new attendees with ticket counts...');
  const attendeesToInsert = Array.from(attendeesMap.values()).map(a => ({
    eventId: EVENT_ID,
    name: a.name,
    phone: a.phone,
    email: a.email || null,
    ticketCount: a.count,
    ticketStatus: 'pending' as const,
  }));
  
  let inserted = 0;
  for (const attendee of attendeesToInsert) {
    await db.insert(eventAttendees).values(attendee);
    inserted++;
  }
  
  console.log(`Successfully inserted ${inserted} unique attendees`);
  
  const multiTicketAttendees = Array.from(attendeesMap.values())
    .filter(a => a.count > 1)
    .sort((a, b) => b.count - a.count);
  
  console.log(`\nAttendees with multiple tickets (${multiTicketAttendees.length}):`);
  multiTicketAttendees.forEach(a => {
    console.log(`  ${a.name} - ${a.phone} - ${a.count} tickets`);
  });
  
  const totalTickets = Array.from(attendeesMap.values()).reduce((sum, a) => sum + a.count, 0);
  console.log(`\nTotal tickets: ${totalTickets}`);
}

syncAttendees().then(() => {
  console.log('\nSync completed!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
