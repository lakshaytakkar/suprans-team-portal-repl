// Twilio integration for SMS and WhatsApp messaging
import twilio from 'twilio';

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
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=twilio',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.account_sid || !connectionSettings.settings.api_key || !connectionSettings.settings.api_key_secret)) {
    throw new Error('Twilio not connected');
  }
  return {
    accountSid: connectionSettings.settings.account_sid,
    apiKey: connectionSettings.settings.api_key,
    apiKeySecret: connectionSettings.settings.api_key_secret,
    phoneNumber: connectionSettings.settings.phone_number
  };
}

export async function getTwilioClient() {
  const { accountSid, apiKey, apiKeySecret } = await getCredentials();
  return twilio(apiKey, apiKeySecret, {
    accountSid: accountSid
  });
}

export async function getTwilioFromPhoneNumber() {
  const { phoneNumber } = await getCredentials();
  return phoneNumber;
}

export interface SendSmsParams {
  to: string;
  message: string;
}

export async function sendSms({ to, message }: SendSmsParams) {
  const client = await getTwilioClient();
  const fromNumber = await getTwilioFromPhoneNumber();
  
  if (!fromNumber) {
    throw new Error('Twilio phone number not configured');
  }

  // Format phone number for India - strip all non-digits first
  let formattedTo = to.replace(/\D/g, '');
  if (formattedTo.startsWith('0')) {
    formattedTo = '91' + formattedTo.substring(1);
  } else if (formattedTo.length === 10) {
    formattedTo = '91' + formattedTo;
  }
  formattedTo = '+' + formattedTo;

  const result = await client.messages.create({
    body: message,
    from: fromNumber,
    to: formattedTo
  });

  return {
    sid: result.sid,
    status: result.status,
    to: result.to
  };
}

export async function sendBulkSms(recipients: Array<{ phone: string; message: string }>) {
  const client = await getTwilioClient();
  const fromNumber = await getTwilioFromPhoneNumber();
  
  if (!fromNumber) {
    throw new Error('Twilio phone number not configured');
  }

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const results: Array<{ phone: string; sid?: string; status?: string; error?: string }> = [];

  // Send in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(async ({ phone, message }) => {
      try {
        // Format phone number for India - strip all non-digits first
        let formattedTo = phone.replace(/\D/g, '');
        if (formattedTo.startsWith('0')) {
          formattedTo = '91' + formattedTo.substring(1);
        } else if (formattedTo.length === 10) {
          formattedTo = '91' + formattedTo;
        }
        formattedTo = '+' + formattedTo;

        const result = await client.messages.create({
          body: message,
          from: fromNumber,
          to: formattedTo
        });
        
        sent++;
        results.push({ phone, sid: result.sid, status: result.status });
      } catch (error: any) {
        failed++;
        const errorMsg = error.message || 'Unknown error';
        errors.push(`${phone}: ${errorMsg}`);
        results.push({ phone, error: errorMsg });
      }
    });

    await Promise.all(promises);

    // Small delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return { sent, failed, errors, results };
}

// Helper to format phone number for WhatsApp
function formatWhatsAppNumber(phone: string): string {
  let formatted = phone.replace(/\D/g, '');
  if (formatted.startsWith('0')) {
    formatted = '91' + formatted.substring(1);
  } else if (formatted.length === 10) {
    formatted = '91' + formatted;
  }
  return 'whatsapp:+' + formatted;
}

export interface SendWhatsAppParams {
  to: string;
  message: string;
}

export async function sendWhatsApp({ to, message }: SendWhatsAppParams) {
  const client = await getTwilioClient();
  const fromNumber = await getTwilioFromPhoneNumber();
  
  if (!fromNumber) {
    throw new Error('Twilio phone number not configured');
  }

  const formattedTo = formatWhatsAppNumber(to);
  const formattedFrom = 'whatsapp:' + fromNumber;

  const result = await client.messages.create({
    body: message,
    from: formattedFrom,
    to: formattedTo
  });

  return {
    sid: result.sid,
    status: result.status,
    to: result.to
  };
}

export async function sendBulkWhatsApp(recipients: Array<{ phone: string; message: string }>) {
  const client = await getTwilioClient();
  const fromNumber = await getTwilioFromPhoneNumber();
  
  if (!fromNumber) {
    throw new Error('Twilio phone number not configured');
  }

  const formattedFrom = 'whatsapp:' + fromNumber;
  
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];
  const results: Array<{ phone: string; sid?: string; status?: string; error?: string }> = [];

  // Send in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    
    const promises = batch.map(async ({ phone, message }) => {
      try {
        const formattedTo = formatWhatsAppNumber(phone);

        const result = await client.messages.create({
          body: message,
          from: formattedFrom,
          to: formattedTo
        });
        
        sent++;
        results.push({ phone, sid: result.sid, status: result.status });
      } catch (error: any) {
        failed++;
        const errorMsg = error.message || 'Unknown error';
        errors.push(`${phone}: ${errorMsg}`);
        results.push({ phone, error: errorMsg });
      }
    });

    await Promise.all(promises);

    // Small delay between batches
    if (i + batchSize < recipients.length) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  return { sent, failed, errors, results };
}
