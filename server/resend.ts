// Resend email integration for bulk email sending
import { Resend } from 'resend';

async function getCredentials() {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Suprans <noreply@suprans.in>';
  
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not configured. Please add it in Secrets.');
  }
  
  return { apiKey, fromEmail };
}

// WARNING: Never cache this client.
// Access tokens expire, so a new client must be created each time.
export async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

export interface BulkEmailOptions {
  to: string[];
  subject: string;
  html: string;
  text?: string;
}

export async function sendBulkEmail(options: BulkEmailOptions): Promise<{ success: boolean; sent: number; failed: number; errors: string[] }> {
  const { client, fromEmail } = await getUncachableResendClient();
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  
  // Send emails in batches of 10 to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < options.to.length; i += batchSize) {
    const batch = options.to.slice(i, i + batchSize);
    
    const promises = batch.map(async (email) => {
      try {
        await client.emails.send({
          from: fromEmail || 'Suprans Business Consulting <noreply@suprans.com>',
          to: email,
          subject: options.subject,
          html: options.html,
          text: options.text,
        });
        sent++;
        return { success: true };
      } catch (error: any) {
        failed++;
        errors.push(`${email}: ${error.message}`);
        return { success: false, email, error: error.message };
      }
    });
    
    await Promise.all(promises);
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < options.to.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return { success: failed === 0, sent, failed, errors };
}
