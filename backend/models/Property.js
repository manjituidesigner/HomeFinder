// Property model
const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  description: String,
  images: [String],
  location: String,
  rooms: Number,
  type: String,
  inclusions: [String],
  rentPrice: Number,
  extraExpenses: Object,
  address: Object,
  contact: String,
});

module.exports = mongoose.model('Property', propertySchema);