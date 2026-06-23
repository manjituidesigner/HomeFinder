const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTP, verifyOTP } = require('../services/twilioOtpService');
const { db } = require('../config/firebase');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_COUNTRY_CODE = process.env.DEFAULT_COUNTRY_CODE || '91';

const normalizeEmail = (email) => email ? String(email).trim().toLowerCase() : null;

const ensurePhone = (phone) => {
  if (!phone) return { ok: false, error: 'Phone is required' };
  let normalized = String(phone).trim().replace(/\s+/g, '');
  if (!normalized.startsWith('+')) {
    normalized = `+${DEFAULT_COUNTRY_CODE}${normalized.replace(/^\+/, '')}`;
  }
  if (!/^\+\d{10,15}$/.test(normalized)) {
    return { ok: false, error: 'Invalid phone format. Use E.164 (e.g. +917986621813)' };
  }
  return { ok: true, phone: normalized };
};

// Signup Initiate
exports.signupInitiate = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    console.log('[Signup] Request:', { name, email, phone, role });

    if (!name || !password || !role) {
      return res.status(400).json({ error: 'Name, PIN/Password, and Role are required' });
    }

    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) return res.status(400).json({ error: phoneCheck.error });
    const normalizedPhone = phoneCheck.phone;
    const normalizedEmail = normalizeEmail(email);

    if (!db) return res.status(503).json({ error: 'Firebase Database not initialized' });

    // Existing User Check
    const usersCol = db.collection('users');
    let exists = false;

    if (normalizedEmail) {
      const emailSnap = await usersCol.where('email', '==', normalizedEmail).get();
      if (!emailSnap.empty) exists = true;
    }
    if (!exists) {
      const phoneSnap = await usersCol.where('phone', '==', normalizedPhone).get();
      if (!phoneSnap.empty) exists = true;
    }

    if (exists) return res.status(400).json({ error: 'User with this email or phone already exists' });

    // Send OTP
    await sendOTP(normalizedPhone);
    res.status(200).json({ message: 'OTP sent successfully', phone: normalizedPhone, otpSent: true });

  } catch (error) {
    console.error('[Signup Initiate Error]:', error);
    res.status(500).json({ error: error.message || 'Server error during signup initiate' });
  }
};

// Signup Verify
exports.signupVerifyOTP = async (req, res) => {
  try {
    const { name, email, phone, password, otp, otpSms, role } = req.body;
    const code = otpSms || otp;

    if (!code) return res.status(400).json({ error: 'OTP is required' });
    
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) return res.status(400).json({ error: phoneCheck.error });
    const normalizedPhone = phoneCheck.phone;

    const isVerified = await verifyOTP(normalizedPhone, code);
    if (!isVerified) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const userData = {
      name,
      email: normalizeEmail(email),
      phone: normalizedPhone,
      password: hashedPassword,
      role: role || 'tenant',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const docRef = await db.collection('users').add(userData);
    const token = jwt.sign({ id: docRef.id, role: userData.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'Registration successful', user: { id: docRef.id, name, role }, token });

  } catch (error) {
    console.error('[Signup Verify Error]:', error);
    res.status(500).json({ error: 'Failed to complete registration' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, phone, password, pin } = req.body;
    const secret = pin || password;

    if (!secret) return res.status(400).json({ error: 'Password or PIN is required' });

    let query = db.collection('users');
    let snapshot;

    if (phone) {
      const phoneCheck = ensurePhone(phone);
      if (!phoneCheck.ok) return res.status(400).json({ error: phoneCheck.error });
      snapshot = await query.where('phone', '==', phoneCheck.phone).limit(1).get();
    } else if (email) {
      snapshot = await query.where('email', '==', normalizeEmail(email)).limit(1).get();
    } else {
      return res.status(400).json({ error: 'Email or Phone is required' });
    }

    if (snapshot.empty) return res.status(401).json({ error: 'Invalid credentials' });

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const isMatch = await bcrypt.compare(String(secret), user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: userDoc.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', user: { id: userDoc.id, name: user.name, role: user.role }, token });

  } catch (error) {
    console.error('[Login Error]:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Forgot Password Initiate
exports.forgotPasswordInitiate = async (req, res) => {
  try {
    const { phone } = req.body;
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) return res.status(400).json({ error: phoneCheck.error });

    const snapshot = await db.collection('users').where('phone', '==', phoneCheck.phone).limit(1).get();
    if (snapshot.empty) return res.status(404).json({ error: 'No user found with this phone number' });

    await sendOTP(phoneCheck.phone);
    res.json({ message: 'OTP sent for password reset', phone: phoneCheck.phone });
  } catch (error) {
    console.error('[Forgot Password Error]:', error);
    res.status(500).json({ error: 'Failed to initiate password reset' });
  }
};

// Forgot Password Verify
exports.forgotPasswordVerifyOTP = async (req, res) => {
  try {
    const { phone, otp, otpSms } = req.body;
    const code = otpSms || otp;
    const phoneCheck = ensurePhone(phone);
    if (!phoneCheck.ok) return res.status(400).json({ error: phoneCheck.error });

    const isVerified = await verifyOTP(phoneCheck.phone, code);
    if (!isVerified) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const snapshot = await db.collection('users').where('phone', '==', phoneCheck.phone).limit(1).get();
    const resetToken = jwt.sign({ id: snapshot.docs[0].id, purpose: 'reset' }, JWT_SECRET, { expiresIn: '15m' });

    res.json({ message: 'OTP verified', resetToken });
  } catch (error) {
    console.error('[Forgot Password Verify Error]:', error);
    res.status(500).json({ error: 'Verification failed' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });

    const decoded = jwt.verify(resetToken, JWT_SECRET);
    if (decoded.purpose !== 'reset') return res.status(400).json({ error: 'Invalid reset token' });

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    await db.collection('users').doc(decoded.id).update({ password: hashedPassword, updatedAt: new Date() });

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('[Reset Password Error]:', error);
    res.status(400).json({ error: 'Token expired or invalid' });
  }
};
