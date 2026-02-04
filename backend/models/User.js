// User model
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  password: String,
  phone: { type: String, unique: true, sparse: true },
  role: { type: String, enum: ['owner', 'tenant', 'broker', 'admin'] },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('validate', function () {
  if (!this.email && !this.phone) {
    this.invalidate('email', 'Either email or phone is required');
    this.invalidate('phone', 'Either phone or email is required');
  }
});

module.exports = mongoose.model('User', userSchema);
