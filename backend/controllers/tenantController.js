// Tenant controller with Firestore
const { db } = require('../config/firebase');

exports.getTenants = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const snapshot = await db.collection('tenants').where('propertyId', '==', req.params.propertyId).get();
    const tenants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(tenants);
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ error: 'Failed to fetch tenants' });
  }
};

exports.getTenant = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const doc = await db.collection('tenants').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Tenant not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ error: 'Failed to fetch tenant' });
  }
};

exports.updateTenant = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const id = req.params.id;
    await db.collection('tenants').doc(id).update({ ...req.body, updatedAt: new Date() });
    const updated = await db.collection('tenants').doc(id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ error: 'Failed to update tenant' });
  }
};