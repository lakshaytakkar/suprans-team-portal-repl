import { Client } from 'pg';

async function extractOriginalData() {
  const originalClient = new Client({
    connectionString: 'postgresql://postgres:password@helium/heliumdb?sslmode=disable'
  });

  try {
    await originalClient.connect();
    console.log('Connected to original database');

    // Get users
    const usersResult = await originalClient.query('SELECT * FROM users');
    console.log('Users:', usersResult.rows.length);
    console.log(JSON.stringify(usersResult.rows, null, 2));

    // Get services
    const servicesResult = await originalClient.query('SELECT * FROM services');
    console.log('\nServices:', servicesResult.rows.length);
    console.log(JSON.stringify(servicesResult.rows, null, 2));

    // Get employees
    const employeesResult = await originalClient.query('SELECT * FROM employees');
    console.log('\nEmployees:', employeesResult.rows.length);

    // Get hr_employees
    const hrEmployeesResult = await originalClient.query('SELECT * FROM hr_employees');
    console.log('\nHR Employees:', hrEmployeesResult.rows.length);

    await originalClient.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

extractOriginalData();
