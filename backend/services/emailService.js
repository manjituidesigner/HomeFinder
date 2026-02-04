// Email service
const nodemailer = require('nodemailer');

const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

exports.sendEmail = async (to, subject, text) => {
  if (!SMTP_USER || !SMTP_PASS) {
    const err = new Error('Missing SMTP credentials. Set SMTP_USER and SMTP_PASS in backend .env');
    err.status = 500;
    throw err;
  }
  if (!to) {
    const err = new Error('Recipient email is required');
    err.status = 400;
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
};