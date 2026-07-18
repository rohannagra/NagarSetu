import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

const createTransporter = () => {
  if (transporter) return transporter;

  transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  return transporter;
};

// Send email function
export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'Nagar Setu'} <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Email error: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  // Welcome email for new citizens
  welcome: (name) => ({
    subject: 'Welcome to Nagar Setu',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏛️ Nagar Setu</h1>
            <p>AI-Powered Smart Complaint Redressal System</p>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for registering with Nagar Setu. You can now submit and track civic complaints with ease.</p>
            <p>Our AI-powered platform ensures your complaints are:</p>
            <ul>
              <li>✅ Automatically classified and routed to the right department</li>
              <li>✅ Tracked in real-time with complete transparency</li>
              <li>✅ Resolved efficiently with officer accountability</li>
            </ul>
            <a href="${process.env.CLIENT_URL}/dashboard" class="button">Go to Dashboard</a>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>Nagar Setu Team</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to Nagar Setu, ${name}! You can now submit and track civic complaints.`
  }),

  // Complaint submitted confirmation
  complaintSubmitted: (name, complaintId, title) => ({
    subject: `Complaint Submitted - ${complaintId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .complaint-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Complaint Submitted</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your complaint has been successfully submitted and is being processed by our AI system.</p>
            <div class="complaint-box">
              <h3>Complaint Details</h3>
              <p><strong>Complaint ID:</strong> ${complaintId}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Status:</strong> Submitted</p>
            </div>
            <p>Your complaint will be verified and assigned to the appropriate department shortly. You will receive updates via email and in-app notifications.</p>
            <a href="${process.env.CLIENT_URL}/complaints/${complaintId}" class="button">Track Complaint</a>
            <p>Thank you for using Nagar Setu!</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Your complaint ${complaintId} has been submitted successfully. Track it at ${process.env.CLIENT_URL}/complaints/${complaintId}`
  }),

  // Complaint status update
  statusUpdate: (name, complaintId, oldStatus, newStatus, remarks) => ({
    subject: `Complaint Update - ${complaintId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .status-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Status Update</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>Your complaint status has been updated:</p>
            <div class="status-box">
              <p><strong>Complaint ID:</strong> ${complaintId}</p>
              <p><strong>Previous Status:</strong> ${oldStatus}</p>
              <p><strong>New Status:</strong> ${newStatus}</p>
              ${remarks ? `<p><strong>Remarks:</strong> ${remarks}</p>` : ''}
            </div>
            <a href="${process.env.CLIENT_URL}/complaints/${complaintId}" class="button">View Details</a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Your complaint ${complaintId} status changed from ${oldStatus} to ${newStatus}.`
  }),

  // Password reset
  passwordReset: (name, resetToken) => ({
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .warning { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Password Reset</h1>
          </div>
          <div class="content">
            <p>Dear ${name},</p>
            <p>You requested to reset your password. Click the button below to proceed:</p>
            <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}" class="button">Reset Password</a>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request this, please ignore this email.
            </div>
            <p>For security reasons, do not share this link with anyone.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Reset your password: ${process.env.CLIENT_URL}/reset-password?token=${resetToken}`
  }),

  // Officer assignment
  officerAssignment: (officerName, complaintId, title, priority) => ({
    subject: `New Complaint Assigned - ${complaintId}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .complaint-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Assignment</h1>
          </div>
          <div class="content">
            <p>Dear ${officerName},</p>
            <p>A new complaint has been assigned to you:</p>
            <div class="complaint-box">
              <p><strong>Complaint ID:</strong> ${complaintId}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Priority:</strong> <span style="color: ${priority === 'critical' ? '#ef4444' : priority === 'high' ? '#f59e0b' : '#10b981'};">${priority.toUpperCase()}</span></p>
            </div>
            <p>Please review and take necessary action.</p>
            <a href="${process.env.CLIENT_URL}/officer/complaints/${complaintId}" class="button">View Complaint</a>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `New complaint ${complaintId} assigned to you. Priority: ${priority}`
  })
};

export default {
  sendEmail,
  emailTemplates
};
