// Twilio Verify API Service (No phone number required)
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID || 'create_one_in_console';

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.');
}

if (!verifyServiceSid || !verifyServiceSid.startsWith('VA')) {
  throw new Error('TWILIO_VERIFY_SERVICE_SID must be a Twilio Verify Service SID that starts with "VA".');
}

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
    const err = new Error(`Failed to send OTP: ${error.message}`);
    const msg = `${error?.message || ''}`;
    if (error && (error.code === 60200 || msg.includes('Invalid parameter `To`'))) {
      err.status = 400;
    }
    if (
      msg.toLowerCase().includes('unverified') ||
      msg.toLowerCase().includes('trial accounts cannot send')
    ) {
      err.status = 400;
      err.message =
        'Failed to send OTP: Your Twilio account is in Trial mode and can only send SMS to verified phone numbers. Verify this phone number in Twilio Console or upgrade your Twilio account.';
    }
    throw err;
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
    const err = new Error(`Failed to verify OTP: ${error.message}`);
    const msg = `${error?.message || ''}`;
    if (error && (error.code === 60200 || msg.includes('Invalid parameter `To`'))) {
      err.status = 400;
    }
    if (
      msg.toLowerCase().includes('unverified') ||
      msg.toLowerCase().includes('trial accounts cannot send')
    ) {
      err.status = 400;
      err.message =
        'Failed to verify OTP: Your Twilio account is in Trial mode and can only verify SMS sent to verified phone numbers. Verify this phone number in Twilio Console or upgrade your Twilio account.';
    }
    throw err;
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
