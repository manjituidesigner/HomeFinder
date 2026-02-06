// Email service using AWS SES SMTP (via MailBluster)
const nodemailer = require("nodemailer");

// Environment variables
const SMTP_HOST = process.env.SMTP_HOST;   // email-smtp.ap-south-1.amazonaws.com
const SMTP_PORT = process.env.SMTP_PORT;   // 587
const SMTP_USER = process.env.SMTP_USER;   // SES SMTP Username
const SMTP_PASS = process.env.SMTP_PASS;   // SES SMTP Password
const SMTP_FROM = process.env.SMTP_FROM;   // verified sender email

// Validation: credentials check at startup
if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
  console.error("❌ SMTP configuration missing in .env file");
}

// Create transporter (SMTP engine)
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false, // true only for port 465
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

// Verify SMTP connection (OPTIONAL but recommended)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection failed:", error.message);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

// Send email function
exports.sendEmail = async (to, subject, text) => {
  // Basic validation
  if (!to) {
    const err = new Error("Recipient email is required");
    err.status = 400;
    throw err;
  }

  if (!subject || !text) {
    const err = new Error("Email subject and text are required");
    err.status = 400;
    throw err;
  }

  // Mail content
  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    error.status = 500;
    throw error;
  }
};
