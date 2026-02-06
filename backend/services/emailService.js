// Email service using SMTP or AWS SES API
const nodemailer = require("nodemailer");
const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

// Environment variables
const EMAIL_TRANSPORT = String(process.env.EMAIL_TRANSPORT || "smtp").toLowerCase();

const SMTP_HOST = process.env.SMTP_HOST;   // email-smtp.ap-south-1.amazonaws.com
const SMTP_PORT = process.env.SMTP_PORT;   // 587
const SMTP_USER = process.env.SMTP_USER;   // SES SMTP Username
const SMTP_PASS = process.env.SMTP_PASS;   // SES SMTP Password
const SMTP_FROM = process.env.SMTP_FROM;   // verified sender email

const AWS_SES_REGION = process.env.AWS_SES_REGION; // e.g. ap-south-1
const AWS_SES_FROM = process.env.AWS_SES_FROM || SMTP_FROM;

// Validation: credentials check at startup
if (EMAIL_TRANSPORT === "smtp") {
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.error("❌ SMTP configuration missing in .env file");
  }
} else if (EMAIL_TRANSPORT === "ses") {
  if (!AWS_SES_REGION || !AWS_SES_FROM) {
    console.error("❌ AWS SES API configuration missing in .env file");
  }
}

let transporter;
if (EMAIL_TRANSPORT === "smtp") {
  // Create transporter (SMTP engine)
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465, // true only for port 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  // Verify SMTP connection (optional but recommended)
  transporter.verify((error) => {
    if (error) {
      console.error("❌ SMTP connection failed:", error.message);
    } else {
      console.log("✅ SMTP server is ready to send emails");
    }
  });
}

const sesClient = EMAIL_TRANSPORT === "ses" && AWS_SES_REGION
  ? new SESClient({ region: AWS_SES_REGION })
  : null;

const sendEmailViaSes = async (to, subject, text) => {
  if (!sesClient) {
    const err = new Error("AWS SES client is not configured");
    err.status = 500;
    throw err;
  }

  if (!AWS_SES_FROM) {
    const err = new Error("AWS_SES_FROM is required for SES API");
    err.status = 500;
    throw err;
  }

  const command = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: { Text: { Data: text } },
    },
    Source: AWS_SES_FROM,
  });

  return sesClient.send(command);
};

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

  try {
    if (EMAIL_TRANSPORT === "ses") {
      return await sendEmailViaSes(to, subject, text);
    }

    if (!transporter) {
      const err = new Error("SMTP transporter is not configured");
      err.status = 500;
      throw err;
    }

    const mailOptions = {
      from: SMTP_FROM,
      to,
      subject,
      text,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("❌ Email send failed:", error.message);
    error.status = 500;
    throw error;
  }
};
