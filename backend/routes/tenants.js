// Tenant routes
const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');

router.get('/:propertyId', tenantController.getTenants);
router.get('/profile/:id', tenantController.getTenant);
router.put('/:id', tenantController.updateTenant);

module.exports = router;