import { Client } from 'pg';

async function compareDatabases() {
  const originalClient = new Client({
    connectionString: 'postgresql://postgres:password@helium/heliumdb?sslmode=disable'
  });

  const currentClient = new Client({
    connectionString: process.env.DATABASE_URL
  });

  const tables = [
    'users', 'services', 'leads', 'activities', 'tasks', 'templates',
    'employees', 'hr_employees', 'candidates', 'candidate_calls',
    'events', 'event_attendees', 'event_hotels', 'event_flights',
    'job_openings', 'job_portals', 'hr_templates', 'venue_comparisons',
    'assets', 'attendance', 'channels', 'travel_packages', 'offices'
  ];

  try {
    await originalClient.connect();
    await currentClient.connect();
    console.log('Connected to both databases\n');

    console.log('Table Name'.padEnd(25) + 'Original'.padEnd(12) + 'Current');
    console.log('-'.repeat(50));

    for (const table of tables) {
      try {
        const origResult = await originalClient.query(`SELECT COUNT(*)::int as count FROM ${table}`);
        const currResult = await currentClient.query(`SELECT COUNT(*)::int as count FROM ${table}`);
        const origCount = origResult.rows[0].count;
        const currCount = currResult.rows[0].count;
        const diff = origCount !== currCount ? ' ⚠️' : '';
        console.log(`${table.padEnd(25)}${String(origCount).padEnd(12)}${currCount}${diff}`);
      } catch (e) {
        console.log(`${table.padEnd(25)}ERROR`);
      }
    }

    await originalClient.end();
    await currentClient.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

compareDatabases();
