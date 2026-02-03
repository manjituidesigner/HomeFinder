// Auth controller with MongoDB, JWT, and Twilio Verify API
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../services/twilioOtpService');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Step 1: Initiate signup and send OTP
exports.signupInitiate = async (req, res) => {
  const { name, email, phone, password, role } = req.body;
  try {
    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Send OTP via Twilio Verify API (no need to generate OTP manually)
    await sendOTP(phone);

    res.status(200).json({
      message: 'OTP sent to your phone',
      email,
      phone,
      otpSent: true,
    });
  } catch (error) {
    console.error('Signup initiate error:', error);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP and complete signup
exports.signupVerifyOTP = async (req, res) => {
  const { email, otp, name, password, phone, role } = req.body;
  try {
    if (!email || !otp || !name || !password || !phone || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Verify OTP using Twilio Verify API
    const isValid = await verifyOTP(phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, phone, role, verified: true });
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
    res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Step 1: Forgot password - send OTP
exports.forgotPasswordInitiate = async (req, res) => {
  const { email, phone } = req.body;
  try {
    if (!email || !phone) {
      return res.status(400).json({ error: 'Email and phone are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.phone !== phone) {
      return res.status(400).json({ error: 'Phone number does not match' });
    }

    // Send OTP via Twilio Verify API
    await sendOTP(phone);

    res.status(200).json({
      message: 'OTP sent to your registered phone number',
      email,
      otpSent: true,
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
};

// Step 2: Verify OTP for forgot password
exports.forgotPasswordVerifyOTP = async (req, res) => {
  const { email, otp, phone } = req.body;
  try {
    if (!email || !otp || !phone) {
      return res.status(400).json({ error: 'Email, phone, and OTP are required' });
    }

    // Verify OTP using Twilio Verify API
    const isValid = await verifyOTP(phone, otp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Generate a temporary token for password reset
    const resetToken = jwt.sign({ email, purpose: 'password-reset' }, JWT_SECRET, { expiresIn: '15m' });

    res.status(200).json({
      message: 'OTP verified. You can now reset your password.',
      resetToken,
      email,
    });
  } catch (error) {
    console.error('Forgot password verify error:', error);
    res.status(500).json({ error: error.message || 'Failed to verify OTP' });
  }
};

// Step 3: Reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, resetToken } = req.body;
  try {
    if (!email || !newPassword || !resetToken) {
      return res.status(400).json({ error: 'All fields are required' });
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
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
