// Tenant controller
const Tenant = require('../models/Tenant');

exports.getTenants = async (req, res) => {
  const tenants = await Tenant.find({ propertyId: req.params.propertyId });
  res.json(tenants);
};

exports.getTenant = async (req, res) => {
  const tenant = await Tenant.findById(req.params.id);
  res.json(tenant);
};

exports.updateTenant = async (req, res) => {
  const tenant = await Tenant.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(tenant);
};