// Twilio Verify API Service (No phone number required)
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || 'create_one_in_console';

const client = twilio(accountSid, authToken);

// Send OTP via Twilio Verify API
const sendOTP = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });
    
    console.log(`OTP sent successfully. Status: ${verification.status}`);
    return {
      success: true,
      message: 'OTP sent successfully',
      status: verification.status,
    };
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

// Verify OTP using Twilio Verify API
const verifyOTP = async (phoneNumber, code) => {
  try {
    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: phoneNumber,
        code: code,
      });
    
    console.log(`Verification status: ${verificationCheck.status}`);
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return false;
  }
};

// Generate OTP (not needed with Verify API, but keeping for compatibility)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
};
