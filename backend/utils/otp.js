// OTP utility
const otpGenerator = require('otp-generator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Generate 6-digit OTP
exports.generateOTP = () => {
  return otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
};

// Create JWT token with OTP
exports.createOTPToken = (email, otp) => {
  return jwt.sign({ email, otp }, JWT_SECRET, { expiresIn: '10m' });
};

// Verify OTP token
exports.verifyOTPToken = (token, otp) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.otp === otp;
  } catch (error) {
    return false;
  }
};