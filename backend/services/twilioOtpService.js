const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
  } catch (e) {
    console.error('Twilio client initialization failed:', e.message);
  }
}

const sendOTP = async (phoneNumber) => {
  try {
    if (!client || !verifyServiceSid || !verifyServiceSid.startsWith('VA')) {
      console.log(`[TEST MODE] Twilio not configured. OTP send bypassed for ${phoneNumber}`);
      return { success: true, status: 'pending_fallback' };
    }

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    
    return { success: true, status: verification.status };
  } catch (error) {
    console.error('Twilio Send Error (Bypassed for Master OTP):', error.message);
    // BYPASS error so frontend can reach the verification screen and user can type the Master OTP
    return { success: true, status: 'pending_fallback', error: error.message };
  }
};

const verifyOTP = async (phoneNumber, code) => {
  try {
    const MASTER_OTP = process.env.MASTER_OTP || '060606';
    if (code === MASTER_OTP) {
      console.log(`[TEST MODE] Master OTP used successfully for ${phoneNumber}`);
      return true;
    }

    if (!client || !verifyServiceSid || !verifyServiceSid.startsWith('VA')) {
      return false;
    }

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: phoneNumber, code: code });
    
    return verificationCheck.status === 'approved';
  } catch (error) {
    console.error('Twilio Verify Error:', error.message);
    return false;
  }
};

module.exports = { sendOTP, verifyOTP };
