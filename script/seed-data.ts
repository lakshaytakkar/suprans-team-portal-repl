import { db } from '../server/db';
import { services, templates, leads, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function seedData() {
  console.log('Seeding additional data...');

  try {
    // Get existing sales user
    const salesUsers = await db.select().from(users).where(eq(users.role, 'sales_executive'));
    const salesExecId = salesUsers[0]?.id;

    // Create services if not exist
    const existingServices = await db.select().from(services);
    if (existingServices.length === 0) {
      await db.insert(services).values([
        { name: 'Web Development', category: 'Development', description: 'Custom website development', pricing: 5000, isActive: true },
        { name: 'Mobile App Development', category: 'Development', description: 'iOS and Android app development', pricing: 10000, isActive: true },
        { name: 'Digital Marketing', category: 'Marketing', description: 'SEO, SEM, and social media marketing', pricing: 2000, isActive: true },
        { name: 'LLC Formation', category: 'Business Services', description: 'Company registration and formation', pricing: 1500, isActive: true },
        { name: 'Trademark Registration', category: 'IP Services', description: 'Trademark and IP protection', pricing: 3000, isActive: true },
        { name: 'GST Registration', category: 'Tax & Compliance', description: 'GST registration and compliance', pricing: 1000, isActive: true },
        { name: 'Import Export License', category: 'Licenses', description: 'IEC and trade licenses', pricing: 5000, isActive: true },
        { name: 'Accounting Services', category: 'Ongoing Services', description: 'Monthly accounting and bookkeeping', pricing: 2500, isActive: true },
      ]);
      console.log('Created 8 services');
    } else {
      console.log(`Services already exist (${existingServices.length})`);
    }

    // Create templates if not exist
    const existingTemplates = await db.select().from(templates);
    if (existingTemplates.length === 0) {
      await db.insert(templates).values([
        { title: 'Welcome Call Script', type: 'script', content: 'Hello [Name], this is [Your Name] from Suprans. I wanted to reach out about your inquiry regarding [Service]...', category: 'Introduction' },
        { title: 'Cold Call - Intro', type: 'script', content: 'Hi [Name], this is [Your Name] from Suprans. We help companies like [Company] streamline their operations. Do you have 2 minutes?', category: 'Cold Outreach' },
        { title: 'Follow-up Email', type: 'email', subject: 'Following up on your inquiry', content: 'Hi [Name],\n\nI wanted to follow up on our conversation about [Service].\n\nBest regards,\n[Your Name]', category: 'Follow-up' },
        { title: 'Initial Outreach', type: 'email', subject: 'Partnership Opportunity', content: 'Hi [Name],\n\nI noticed that [Company] is doing great work. We specialize in [Service] and believe we can help you scale.\n\nBest,\n[Your Name]', category: 'Outreach' },
        { title: 'Price Objection', type: 'objection', content: 'I understand budget is a concern. Our solution typically has an ROI of 3x within 6 months. Let me explain the value...', category: 'Pricing' },
        { title: 'Competitor Objection', type: 'objection', content: "That's great that you see value in this service! What's one thing you wish they did better?", category: 'Competition' },
        { title: 'WhatsApp Intro', type: 'message', content: 'Hi [Name], this is [Your Name] from Suprans. Saw your inquiry about [Service]. Is now a good time to chat?', category: 'WhatsApp' },
      ]);
      console.log('Created 7 templates');
    } else {
      console.log(`Templates already exist (${existingTemplates.length})`);
    }

    // Create sample leads if not exist
    const existingLeads = await db.select().from(leads);
    if (existingLeads.length === 0 && salesExecId) {
      await db.insert(leads).values([
        { name: 'Amit Kumar', company: 'TechStart Pvt Ltd', phone: '+91 99887 76655', email: 'amit@techstart.com', service: 'LLC Formation', value: 150000, stage: 'qualified', assignedTo: salesExecId, source: 'Website', rating: 4, temperature: 'hot', tags: ['High Value', 'Urgent'] },
        { name: 'Priya Sharma', company: 'Innovation Labs', phone: '+91 98765 43210', email: 'priya@innovationlabs.com', service: 'Trademark Registration', value: 75000, stage: 'proposal', assignedTo: salesExecId, source: 'Referral', rating: 5, temperature: 'hot', tags: ['IP Services'] },
        { name: 'Rajesh Gupta', company: 'Export House India', phone: '+91 87654 32109', email: 'rajesh@exporthouseindia.com', service: 'Import Export License', value: 200000, stage: 'negotiation', assignedTo: salesExecId, source: 'Trade Fair', rating: 4, temperature: 'warm', tags: ['Export', 'License'] },
        { name: 'Sneha Patel', company: 'Digital First Media', phone: '+91 76543 21098', email: 'sneha@digitalfirstmedia.com', service: 'Digital Marketing', value: 50000, stage: 'contacted', assignedTo: null, source: 'Website', rating: 3, temperature: 'warm', tags: ['Marketing'] },
        { name: 'Vikram Singh', company: 'Singh Enterprises', phone: '+91 65432 10987', email: 'vikram@singhenterprises.com', service: 'GST Registration', value: 25000, stage: 'new', assignedTo: null, source: 'Cold Call', rating: 2, temperature: 'cold', tags: ['Tax'] },
      ]);
      console.log('Created 5 sample leads');
    } else {
      console.log(`Leads already exist (${existingLeads.length}) or no sales exec found`);
    }

    console.log('Data seeding complete!');
    
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
}

seedData()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
