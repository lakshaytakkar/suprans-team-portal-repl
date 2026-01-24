// Resend email integration for bulk email sending
import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return { apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email };
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
