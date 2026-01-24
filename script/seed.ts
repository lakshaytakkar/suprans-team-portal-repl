import { db } from '../server/db';
import { users, leads, services, templates } from '../shared/schema';
import { hashPassword } from '../server/auth';

async function seed() {
  console.log('Seeding database...');

  try {
    // Create users
    const hashedPassword = await hashPassword('admin123');
    
    const [superAdmin] = await db.insert(users).values({
      name: 'Admin User',
      email: 'admin@suprans.com',
      password: hashedPassword,
      role: 'superadmin',
      phone: '+1234567890',
    }).returning();

    const [salesExec] = await db.insert(users).values({
      name: 'John Sales',
      email: 'sales@suprans.com',
      password: await hashPassword('sales123'),
      role: 'sales_executive',
      phone: '+1234567891',
    }).returning();

    console.log('Created users:', superAdmin.email, salesExec.email);

    // Create services
    await db.insert(services).values([
      {
        name: 'Web Development',
        category: 'Development',
        description: 'Custom website development',
        pricing: 5000,
        isActive: true,
      },
      {
        name: 'Mobile App Development',
        category: 'Development',
        description: 'iOS and Android app development',
        pricing: 10000,
        isActive: true,
      },
      {
        name: 'Digital Marketing',
        category: 'Marketing',
        description: 'SEO, SEM, and social media marketing',
        pricing: 2000,
        isActive: true,
      },
      {
        name: 'Consulting',
        category: 'Consulting',
        description: 'Business and technical consulting',
        pricing: 1500,
        isActive: true,
      },
    ]);

    console.log('Created services');

    // Create sample leads
    await db.insert(leads).values([
      {
        name: 'Alice Johnson',
        company: 'TechCorp Inc',
        phone: '+1234567892',
        email: 'alice@techcorp.com',
        service: 'Web Development',
        value: 15000,
        stage: 'qualified',
        assignedTo: salesExec.id,
        source: 'Referral',
        rating: 4,
        temperature: 'hot',
        tags: ['enterprise', 'urgent'],
      },
      {
        name: 'Bob Smith',
        company: 'StartupXYZ',
        phone: '+1234567893',
        email: 'bob@startupxyz.com',
        service: 'Mobile App Development',
        value: 25000,
        stage: 'proposal',
        assignedTo: salesExec.id,
        source: 'Website',
        rating: 5,
        temperature: 'hot',
        tags: ['startup', 'mobile'],
      },
      {
        name: 'Carol Williams',
        company: 'Marketing Plus',
        phone: '+1234567894',
        email: 'carol@marketingplus.com',
        service: 'Digital Marketing',
        value: 5000,
        stage: 'contacted',
        assignedTo: null,
        source: 'Cold Call',
        rating: 3,
        temperature: 'warm',
        tags: ['marketing'],
      },
    ]);

    console.log('Created sample leads');

    // Create templates
    await db.insert(templates).values([
      {
        title: 'Welcome Call Script',
        type: 'script',
        content: 'Hello [Name], this is [Your Name] from Suprans. I wanted to reach out about your inquiry regarding [Service]...',
        category: 'Introduction',
      },
      {
        title: 'Follow-up Email',
        type: 'email',
        subject: 'Following up on your inquiry',
        content: 'Hi [Name],\n\nI wanted to follow up on our conversation about [Service]...',
        category: 'Follow-up',
      },
      {
        title: 'Price Objection',
        type: 'objection',
        content: 'I understand budget is a concern. Let me explain the value you\'ll receive...',
        category: 'Pricing',
      },
    ]);

    console.log('Created templates');

    console.log('✅ Database seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Admin: admin@suprans.com / admin123');
    console.log('Sales: sales@suprans.com / sales123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
