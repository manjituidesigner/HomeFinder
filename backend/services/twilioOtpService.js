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
      throw new Error('Twilio Verify SID is missing or invalid. Use test number +917986621813.');
    }

    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: phoneNumber, channel: 'sms' });
    
    return { success: true, status: verification.status };
  } catch (error) {
    console.error('Twilio Send Error:', error.message);
    throw error;
  }
};

const verifyOTP = async (phoneNumber, code) => {
  try {
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
