import { Client } from 'pg';

async function verifyExactMatch() {
  const originalClient = new Client({
    connectionString: 'postgresql://postgres:password@helium/heliumdb?sslmode=disable'
  });

  const currentClient = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await originalClient.connect();
    await currentClient.connect();

    // Compare users exactly
    console.log('=== USERS ===');
    const origUsers = await originalClient.query('SELECT id, name, email, password, role, phone FROM users ORDER BY email');
    const currUsers = await currentClient.query('SELECT id, name, email, password, role, phone FROM users ORDER BY email');
    
    console.log('Original Users:');
    origUsers.rows.forEach(u => console.log(`  ${u.email} | ${u.name} | ${u.role} | ${u.id}`));
    console.log('\nCurrent Users:');
    currUsers.rows.forEach(u => console.log(`  ${u.email} | ${u.name} | ${u.role} | ${u.id}`));

    // Check if passwords match
    console.log('\nPassword Hash Match:');
    for (let i = 0; i < origUsers.rows.length; i++) {
      const orig = origUsers.rows[i];
      const curr = currUsers.rows.find(u => u.email === orig.email);
      if (curr) {
        console.log(`  ${orig.email}: ${orig.password === curr.password ? '✓ MATCH' : '✗ DIFFERENT'}`);
      }
    }

    // Compare HR employees
    console.log('\n=== HR EMPLOYEES ===');
    const origHR = await originalClient.query('SELECT name, email, role, department FROM hr_employees ORDER BY name LIMIT 15');
    console.log('Original HR Employees:');
    origHR.rows.forEach(e => console.log(`  ${e.name} | ${e.email} | ${e.role} | ${e.department}`));

    const currHR = await currentClient.query('SELECT name, email, role, department FROM hr_employees ORDER BY name LIMIT 15');
    console.log('\nCurrent HR Employees:');
    currHR.rows.forEach(e => console.log(`  ${e.name} | ${e.email} | ${e.role} | ${e.department}`));

    // Compare services
    console.log('\n=== SERVICES ===');
    const origSvc = await originalClient.query('SELECT name, category, pricing FROM services ORDER BY name');
    console.log('Original Services:');
    origSvc.rows.forEach(s => console.log(`  ${s.name} | ${s.category} | ₹${s.pricing}`));

    await originalClient.end();
    await currentClient.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyExactMatch();
