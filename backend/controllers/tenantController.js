// Tenant controller
const mongoose = require('mongoose');
const Tenant = require('../models/Tenant');

const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
    });
    return false;
  }
  return true;
};

exports.getTenants = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const tenants = await Tenant.find({ propertyId: req.params.propertyId });
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

exports.getTenant = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const tenant = await Tenant.findById(req.params.id);
    res.json(tenant);
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(tenant);
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};