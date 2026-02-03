// Tenant model
const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
  profilePhoto: String,
  aadharNumber: String,
  aadharPhoto: String,
  mobile: String,
  alternateMobile: String,
  lastAddress: String,
  profession: String,
  jobLocation: String,
  vehicle: String,
  maritalStatus: String,
  livingWith: String,
  workingHours: String,
  vegetarian: Boolean,
  drink: Boolean,
  payments: [Object],
});

module.exports = mongoose.model('Tenant', tenantSchema);