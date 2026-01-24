import { Client } from 'pg';
import crypto from 'crypto';

async function deepCompare() {
  const originalClient = new Client({
    connectionString: 'postgresql://postgres:password@helium/heliumdb?sslmode=disable'
  });

  const currentClient = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await originalClient.connect();
    await currentClient.connect();

    const tablesResult = await originalClient.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);

    console.log('=== DEEP ROW-BY-ROW DATA COMPARISON ===\n');

    let totalTables = 0;
    let matchingTables = 0;
    let mismatchDetails: any[] = [];

    for (const row of tablesResult.rows) {
      const table = row.table_name;
      totalTables++;

      try {
        // Get primary key column
        const pkResult = await originalClient.query(`
          SELECT a.attname FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = '"${table}"'::regclass AND i.indisprimary
        `);
        
        const pkColumn = pkResult.rows.length > 0 ? pkResult.rows[0].attname : 'id';

        // Get all rows from both databases ordered by primary key
        const origRows = await originalClient.query(`SELECT * FROM "${table}" ORDER BY "${pkColumn}"`);
        const currRows = await currentClient.query(`SELECT * FROM "${table}" ORDER BY "${pkColumn}"`);

        if (origRows.rowCount !== currRows.rowCount) {
          console.log(`❌ ${table}: Row count mismatch (orig: ${origRows.rowCount}, curr: ${currRows.rowCount})`);
          mismatchDetails.push({ table, type: 'count', origCount: origRows.rowCount, currCount: currRows.rowCount });
          continue;
        }

        if (origRows.rowCount === 0) {
          console.log(`✓ ${table}: Empty (0 rows)`);
          matchingTables++;
          continue;
        }

        // Compare row by row
        let rowMismatches = 0;
        let diffDetails: any[] = [];

        for (let i = 0; i < origRows.rows.length; i++) {
          const origRow = origRows.rows[i];
          const currRow = currRows.rows[i];
          
          const origHash = crypto.createHash('md5').update(JSON.stringify(origRow)).digest('hex');
          const currHash = crypto.createHash('md5').update(JSON.stringify(currRow)).digest('hex');

          if (origHash !== currHash) {
            rowMismatches++;
            if (diffDetails.length < 3) {
              // Find specific column differences
              const colDiffs: string[] = [];
              for (const key of Object.keys(origRow)) {
                if (JSON.stringify(origRow[key]) !== JSON.stringify(currRow[key])) {
                  colDiffs.push(key);
                }
              }
              diffDetails.push({
                pk: origRow[pkColumn],
                columns: colDiffs,
                orig: colDiffs.reduce((acc, col) => ({ ...acc, [col]: origRow[col] }), {}),
                curr: colDiffs.reduce((acc, col) => ({ ...acc, [col]: currRow[col] }), {})
              });
            }
          }
        }

        if (rowMismatches > 0) {
          console.log(`❌ ${table}: ${rowMismatches} row(s) differ out of ${origRows.rowCount}`);
          mismatchDetails.push({ table, type: 'data', mismatches: rowMismatches, total: origRows.rowCount, details: diffDetails });
        } else {
          console.log(`✓ ${table}: All ${origRows.rowCount} rows match exactly`);
          matchingTables++;
        }

      } catch (e: any) {
        console.log(`⚠️ ${table}: Error - ${e.message.substring(0, 50)}`);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\nSUMMARY: ${matchingTables}/${totalTables} tables match exactly`);

    if (mismatchDetails.length > 0) {
      console.log('\n=== MISMATCH DETAILS ===');
      for (const m of mismatchDetails) {
        console.log(`\nTable: ${m.table}`);
        if (m.type === 'count') {
          console.log(`  Count mismatch: Original has ${m.origCount}, Current has ${m.currCount}`);
        } else {
          console.log(`  ${m.mismatches} rows differ`);
          if (m.details && m.details.length > 0) {
            console.log('  Sample differences:');
            for (const d of m.details) {
              console.log(`    Row ${d.pk}: Columns differ: ${d.columns.join(', ')}`);
              console.log(`      Original: ${JSON.stringify(d.orig)}`);
              console.log(`      Current:  ${JSON.stringify(d.curr)}`);
            }
          }
        }
      }
    } else {
      console.log('\n✅ ALL DATA MATCHES EXACTLY!');
    }

    await originalClient.end();
    await currentClient.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

deepCompare();
