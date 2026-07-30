const nodemailer = require('nodemailer');

let transporter;

const setupTransporter = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.RESEND_API_KEY) {
    // Production: Use Resend via SMTP
    transporter = nodemailer.createTransport({
      host: 'smtp.resend.com',
      port: 465,
      secure: true,
      auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY
      }
    });
  } else {
    // Development/Testing: Use Ethereal Email
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass  // generated ethereal password
      }
    });
    console.log('[Email Setup] Ethereal Email testing account created.');
  }
};

const sendNotification = async (subject, text) => {
  if (!transporter) await setupTransporter();
  
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || '"Dr. Khare Website" <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL || 'drkhare@example.com',
      subject,
      text
    });
    
    console.log(`[Email Sent] Message ID: ${info.messageId}`);
    
    // If using Ethereal, log the URL to preview the email
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log(`[Ethereal Preview URL] ${nodemailer.getTestMessageUrl(info)}`);
      return { success: true, previewUrl: nodemailer.getTestMessageUrl(info) };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendNotification };
