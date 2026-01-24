import { Client } from 'pg';

async function fullCompare() {
  const originalClient = new Client({
    connectionString: 'postgresql://postgres:password@helium/heliumdb?sslmode=disable'
  });

  const currentClient = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await originalClient.connect();
    await currentClient.connect();

    // Get all tables
    const tablesResult = await originalClient.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('=== COMPREHENSIVE DATABASE COMPARISON ===\n');
    console.log('Table'.padEnd(30) + 'Original'.padEnd(12) + 'Current'.padEnd(12) + 'Status');
    console.log('-'.repeat(70));

    const mismatches: string[] = [];

    for (const row of tablesResult.rows) {
      const table = row.table_name;
      try {
        const origResult = await originalClient.query(`SELECT COUNT(*)::int as count FROM "${table}"`);
        const currResult = await currentClient.query(`SELECT COUNT(*)::int as count FROM "${table}"`);
        const origCount = origResult.rows[0].count;
        const currCount = currResult.rows[0].count;
        
        let status = '✓ OK';
        if (origCount !== currCount) {
          status = `⚠️ DIFF (orig has ${origCount - currCount > 0 ? '+' : ''}${origCount - currCount})`;
          mismatches.push(table);
        }
        console.log(`${table.padEnd(30)}${String(origCount).padEnd(12)}${String(currCount).padEnd(12)}${status}`);
      } catch (e: any) {
        console.log(`${table.padEnd(30)}ERROR: ${e.message.substring(0, 30)}`);
      }
    }

    if (mismatches.length > 0) {
      console.log('\n\n=== TABLES WITH DIFFERENCES ===');
      for (const table of mismatches) {
        console.log(`\nTable: ${table}`);
        const origData = await originalClient.query(`SELECT * FROM "${table}" LIMIT 3`);
        const currData = await currentClient.query(`SELECT * FROM "${table}" LIMIT 3`);
        console.log(`Original has ${origData.rowCount} sample rows`);
        console.log(`Current has ${currData.rowCount} sample rows`);
      }
    } else {
      console.log('\n✅ All tables match perfectly!');
    }

    await originalClient.end();
    await currentClient.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

fullCompare();
