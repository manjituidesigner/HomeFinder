// Auth controller with MongoDB, JWT, and Twilio Verify API
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../services/twilioOtpService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '91';

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

const ensurePhone = (phone) => {
  const normalizedPhone = String(phone || '').trim();
  if (!normalizedPhone) {
    return { ok: false, error: 'Phone is required' };
  }
  if (!/^\+\d{10,15}$/.test(normalizedPhone)) {
    return {
      ok: false,
      error: 'Phone number must be in E.164 format, e.g. +917986621813',
    };
  }
  return { ok: true, phone: normalizedPhone };
};

// Step 1: Initiate signup and send OTP
exports.signupInitiate = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) {
      return res.status(400).json({ error: phoneCheck.error });
    }
    const normalizedPhone = phoneCheck.phone;

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

    await sendOTP(normalizedPhone);

    res.status(200).json({
      message: 'OTP sent to your phone',
      email: normalizedEmail,
      phone: normalizedPhone,
      otpSent: true,
      otpVia: 'sms',
    });
  } catch (error) {
    console.error('Signup initiate error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP and complete signup
exports.signupVerifyOTP = async (req, res) => {
  const { email, otp, otpSms, name, password, phone, role } = req.body;
  try {
    if (!name || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const normalizedEmail = email ? normalizeEmail(email) : undefined;
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) {
      return res.status(400).json({ error: phoneCheck.error });
    }
    const normalizedPhone = phoneCheck.phone;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const code = otpSms || otp;
    if (!code) return res.status(400).json({ error: 'OTP is required' });
    const isValid = await verifyOTP(normalizedPhone, code);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
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
  const { phone } = req.body;
  try {
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) {
      return res.status(400).json({ error: phoneCheck.error });
    }
    const normalizedPhone = phoneCheck.phone;

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const resolvedUser = await User.findOne({ phone: normalizedPhone });
    if (!resolvedUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!resolvedUser.phone) {
      return res.status(400).json({ error: 'No phone number is registered for this account' });
    }

    await sendOTP(normalizedPhone);

    res.status(200).json({
      message: 'OTP sent to your registered phone number',
      email: resolvedUser.email,
      phone: normalizedPhone,
      otpSent: true,
      otpVia: 'sms',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP for forgot password
exports.forgotPasswordVerifyOTP = async (req, res) => {
  const { otp, otpSms, phone } = req.body;
  try {
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) {
      return res.status(400).json({ error: phoneCheck.error });
    }
    const normalizedPhone = phoneCheck.phone;

    if (!(otpSms || otp)) {
      return res.status(400).json({ error: 'OTP is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    const resolvedUser = await User.findOne({ phone: normalizedPhone });
    if (!resolvedUser) {
      return res.status(400).json({ error: 'User not found' });
    }

    const code = otpSms || otp;
    const isValid = await verifyOTP(normalizedPhone, code);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign({ userId: resolvedUser._id, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
      resetToken,
      email: resolvedUser.email,
      phone: resolvedUser.phone,
    });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Step 3: Reset password
exports.resetPassword = async (req, res) => {
  const { email, phone, newPassword, resetToken } = req.body;
  try {
    if (!newPassword || !resetToken) {
      return res.status(400).json({ error: 'Password and reset token are required' });
    }

    if (!email && !phone) {
      return res.status(400).json({ error: 'Email or phone is required' });
    }

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, JWT_SECRET);
      if (decoded.purpose !== 'password-reset' || !decoded.userId) {
        return res.status(400).json({ error: 'Invalid or expired reset token' });
      }
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (email && normalizeEmail(user.email) !== normalizeEmail(email)) {
      return res.status(400).json({ error: 'Email does not match' });
    }

    if (phone && String(user.phone || '').trim() !== String(phone).trim()) {
      return res.status(400).json({ error: 'Phone number does not match' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

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
