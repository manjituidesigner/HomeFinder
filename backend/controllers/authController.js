// Auth controller with MongoDB, JWT, and Twilio Verify API
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOTP, verifyOTP } = require('../services/twilioOtpService');
const { sendEmail } = require('../services/emailService');
const { generateOTP } = require('../utils/otp');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '91';

const OTP_TTL_SECONDS = Number(process.env.OTP_TTL_SECONDS) || 600;

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const determineOtpMode = ({ email, phone, otpVia }) => {
  const hasEmail = !!email;
  const hasPhone = !!phone;
  const requested = String(otpVia || '').toLowerCase();

  if (hasEmail && hasPhone) return 'both';
  if (requested === 'email') return 'email';
  if (requested === 'sms' || requested === 'phone') return 'sms';
  if (hasEmail) return 'email';
  if (hasPhone) return 'sms';
  return 'none';
};

const createEmailOtp = async ({ email, purpose }) => {
  const otp = generateOTP();
  console.log('[email-otp] generated', { purpose, length: String(otp).length });
  const otpHash = await bcrypt.hash(String(otp), 10);

  await OTP.findOneAndUpdate(
    { email, purpose },
    { email, otp: otpHash, purpose, verified: false, attempts: 0, createdAt: new Date() },
    { upsert: true, new: true }
  );

  const subject = 'Your OTP Code';
  const text = `Your OTP is ${otp}. It will expire in ${Math.floor(OTP_TTL_SECONDS / 60)} minutes.`;
  await sendEmail(email, subject, text);
};

const verifyEmailOtp = async ({ email, otp, purpose }) => {
  const record = await OTP.findOne({ email, purpose }).sort({ createdAt: -1 });
  if (!record) return { ok: false, reason: 'not_found' };
  if (record.verified) return { ok: true };
  if (record.attempts >= 3) return { ok: false, reason: 'too_many_attempts' };

  const isMatch = await bcrypt.compare(String(otp), record.otp);
  if (!isMatch) {
    record.attempts = (record.attempts || 0) + 1;
    await record.save();
    return { ok: false, reason: 'invalid' };
  }

  record.verified = true;
  await record.save();
  return { ok: true };
};

// Step 1: Initiate signup and send OTP
exports.signupInitiate = async (req, res) => {
  const { name, email, phone, password, role, otpVia } = req.body;
  try {
    if (!name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const normalizedPhoneRaw = phone ? String(phone).trim() : undefined;
    const otpMode = determineOtpMode({ email: normalizedEmail, phone: normalizedPhoneRaw, otpVia });

    if (otpMode === 'none') {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    if (otpMode === 'both') {
      return res.status(400).json({ error: 'Choose either email or phone for password recovery' });
    }

    let normalizedPhone;
    if (otpMode === 'sms' || otpMode === 'both') {
      if (!normalizedPhoneRaw) {
        return res.status(400).json({ error: 'Phone is required' });
      }
      normalizedPhone = normalizedPhoneRaw;
      if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Phone number must be in E.164 format, e.g. +917986621813',
        });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const existingUser = await User.findOne({
      $or: [
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
        ...(normalizedPhone ? [{ phone: normalizedPhone }] : []),
      ],
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    if (otpMode === 'email' || otpMode === 'both') {
      await createEmailOtp({ email: normalizedEmail, purpose: 'signup' });
    }
    if (otpMode === 'sms' || otpMode === 'both') {
      await sendOTP(normalizedPhone);
    }

    res.status(200).json({
      message:
        otpMode === 'both'
          ? 'OTP sent to your email and phone'
          : otpMode === 'email'
            ? 'OTP sent to your email'
            : 'OTP sent to your phone',
      email: normalizedEmail,
      phone: normalizedPhone,
      otpSent: true,
      otpVia: otpMode,
    });
  } catch (error) {
    console.error('Signup initiate error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP and complete signup
exports.signupVerifyOTP = async (req, res) => {
  const { email, otp, otpEmail, otpSms, name, password, phone, role, otpVia } = req.body;
  try {
    if (!name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const normalizedPhoneRaw = phone ? String(phone).trim() : undefined;
    const otpMode = determineOtpMode({ email: normalizedEmail, phone: normalizedPhoneRaw, otpVia });

    if (otpMode === 'none') {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    let normalizedPhone;
    if (otpMode === 'sms' || otpMode === 'both') {
      if (!normalizedPhoneRaw) {
        return res.status(400).json({ error: 'Phone is required' });
      }
      normalizedPhone = normalizedPhoneRaw;
      if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Phone number must be in E.164 format, e.g. +917986621813',
        });
      }
    }
    if (otpMode === 'email' || otpMode === 'both') {
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    if (otpMode === 'both') {
      if (!otpEmail || !otpSms) {
        return res.status(400).json({ error: 'Both email OTP and SMS OTP are required' });
      }
      const emailResult = await verifyEmailOtp({ email: normalizedEmail, otp: otpEmail, purpose: 'signup' });
      if (!emailResult.ok) {
        return res.status(400).json({ error: 'Invalid or expired email OTP' });
      }
      const smsValid = await verifyOTP(normalizedPhone, otpSms);
      if (!smsValid) {
        return res.status(400).json({ error: 'Invalid or expired SMS OTP' });
      }
    } else if (otpMode === 'email') {
      const code = otpEmail || otp;
      if (!code) return res.status(400).json({ error: 'OTP is required' });
      const result = await verifyEmailOtp({ email: normalizedEmail, otp: code, purpose: 'signup' });
      if (!result.ok) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    } else {
      const code = otpSms || otp;
      if (!code) return res.status(400).json({ error: 'OTP is required' });
      const isValid = await verifyOTP(normalizedPhone, code);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      phone: normalizedPhone,
      role,
      verified: true,
    });
    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: user._id, name, email, role },
      token,
    });
  } catch (error) {
    console.error('Signup verify error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Step 1: Forgot password - send OTP
exports.forgotPasswordInitiate = async (req, res) => {
  const { email, phone, otpVia } = req.body;
  try {
    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const normalizedPhoneRaw = phone ? String(phone).trim() : undefined;
    const otpMode = determineOtpMode({ email: normalizedEmail, phone: normalizedPhoneRaw, otpVia });

    if (otpMode === 'none') {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    let normalizedPhone;
    if (otpMode === 'sms' || otpMode === 'both') {
      if (!phone) {
        return res.status(400).json({ error: 'Phone is required' });
      }
      normalizedPhone = String(phone).trim();
      if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Phone number must be in E.164 format, e.g. +917986621813',
        });
      }
    }
    if (otpMode === 'email' || otpMode === 'both') {
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const user = normalizedEmail ? await User.findOne({ email: normalizedEmail }) : null;
    const userByPhone = normalizedPhone ? await User.findOne({ phone: normalizedPhone }) : null;
    const resolvedUser = userByPhone || user;
    if (!resolvedUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (normalizedEmail && resolvedUser.email !== normalizedEmail) {
      return res.status(400).json({ error: 'Email does not match' });
    }

    if ((otpMode === 'sms' || otpMode === 'both') && resolvedUser.phone && resolvedUser.phone !== normalizedPhone) {
      return res.status(400).json({ error: 'Phone number does not match' });
    }

    if (otpMode === 'email' || otpMode === 'both') {
      if (!resolvedUser.email) {
        return res.status(400).json({ error: 'No email is registered for this account' });
      }
      await createEmailOtp({ email: resolvedUser.email, purpose: 'forgot-password' });
    }
    if (otpMode === 'sms' || otpMode === 'both') {
      if (!resolvedUser.phone) {
        return res.status(400).json({ error: 'No phone number is registered for this account' });
      }
      await sendOTP(normalizedPhone);
    }

    res.status(200).json({
      message:
        otpMode === 'both'
          ? 'OTP sent to your registered email and phone'
          : otpMode === 'email'
            ? 'OTP sent to your registered email'
            : 'OTP sent to your registered phone number',
      email: resolvedUser.email,
      phone: normalizedPhone,
      otpSent: true,
      otpVia: otpMode,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP for forgot password
exports.forgotPasswordVerifyOTP = async (req, res) => {
  const { email, otp, otpEmail, otpSms, phone, otpVia } = req.body;
  try {
    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const normalizedPhoneRaw = phone ? String(phone).trim() : undefined;
    const otpMode = determineOtpMode({ email: normalizedEmail, phone: normalizedPhoneRaw, otpVia });

    if (otpMode === 'none') {
      return res.status(400).json({ error: 'Either email or phone is required' });
    }

    if (otpMode === 'both') {
      return res.status(400).json({ error: 'Choose either email or phone for password recovery' });
    }

    if (otpMode === 'email') {
      if (!(otpEmail || otp)) {
        return res.status(400).json({ error: 'OTP is required' });
      }
    } else {
      if (!(otpSms || otp)) {
        return res.status(400).json({ error: 'OTP is required' });
      }
    }

    let normalizedPhone;
    if (otpMode === 'sms' || otpMode === 'both') {
      if (!phone) {
        return res.status(400).json({ error: 'Phone is required' });
      }
      normalizedPhone = String(phone).trim();
      if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Phone number must be in E.164 format, e.g. +917986621813',
        });
      }
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    let resolvedUser;
    if (otpMode === 'both') {
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
      resolvedUser = await User.findOne({ email: normalizedEmail });
      if (!resolvedUser) {
        resolvedUser = await User.findOne({ phone: normalizedPhone });
      }
      if (!resolvedUser) {
        return res.status(400).json({ error: 'User not found' });
      }
      if (resolvedUser.email !== normalizedEmail) {
        return res.status(400).json({ error: 'Email does not match' });
      }
      if (resolvedUser.phone !== normalizedPhone) {
        return res.status(400).json({ error: 'Phone number does not match' });
      }
      const emailResult = await verifyEmailOtp({ email: normalizedEmail, otp: otpEmail, purpose: 'forgot-password' });
      if (!emailResult.ok) {
        return res.status(400).json({ error: 'Invalid or expired email OTP' });
      }
      const smsValid = await verifyOTP(normalizedPhone, otpSms);
      if (!smsValid) {
        return res.status(400).json({ error: 'Invalid or expired SMS OTP' });
      }
    } else if (otpMode === 'email') {
      if (!normalizedEmail) {
        return res.status(400).json({ error: 'Email is required' });
      }
      resolvedUser = await User.findOne({ email: normalizedEmail });
      if (!resolvedUser) {
        return res.status(400).json({ error: 'User not found' });
      }
      const code = otpEmail || otp;
      const result = await verifyEmailOtp({ email: normalizedEmail, otp: code, purpose: 'forgot-password' });
      if (!result.ok) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    } else {
      resolvedUser = await User.findOne({ phone: normalizedPhone });
      if (!resolvedUser) {
        return res.status(400).json({ error: 'User not found' });
      }
      if (normalizedEmail && resolvedUser.email !== normalizedEmail) {
        return res.status(400).json({ error: 'Email does not match' });
      }
      const code = otpSms || otp;
      const isValid = await verifyOTP(normalizedPhone, code);
      if (!isValid) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign({ email: resolvedUser.email, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
      resetToken,
      email: resolvedUser.email,
    });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Step 3: Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, resetToken } = req.body;
  try {
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET);
      if (decoded.email !== email || decoded.purpose !== 'password-reset') {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ email }, { password: hashedPassword });

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: error.message || 'Failed to reset password' });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password, phone, pin } = req.body;
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const rawSecret = typeof pin === 'string' && pin.length > 0 ? pin : password;
    if (!rawSecret) {
      return res.status(400).json({ error: 'PIN is required' });
    }

    let user;
    if (phone) {
      const digitsOnly = String(phone).replace(/[^0-9+]/g, '').trim();
      const normalizedPhone = digitsOnly.startsWith('+')
        ? digitsOnly
        : digitsOnly.length === 10
          ? `+${DEFAULT_COUNTRY_CODE}${digitsOnly}`
          : `+${digitsOnly}`;

      if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
        return res.status(400).json({
          error: 'Phone number must be valid (E.164). Example: +917986621813',
        });
      }

      user = await User.findOne({ phone: normalizedPhone });
    } else if (email) {
      const normalizedEmail = normalizeEmail(email);
      user = await User.findOne({ email: normalizedEmail });
    } else {
      return res.status(400).json({ error: 'Phone (preferred) or email is required' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(String(rawSecret), user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
