// Property controller with Firestore
const { db } = require('../config/firebase');
const { uploadImage } = require('../services/imageService');
const fs = require('fs');
const path = require('path');

exports.getProperties = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const snapshot = await db.collection('properties').get();
    const properties = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

exports.createProperty = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const propertyData = { ...req.body };
    
    // Parse stringified JSON fields from FormData
    ['amenities', 'customCharges', 'images'].forEach(field => {
      if (typeof propertyData[field] === 'string') {
        try {
          propertyData[field] = JSON.parse(propertyData[field]);
        } catch (e) {
          console.warn(`Failed to parse ${field}:`, e);
        }
      }
    });

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const os = require('os');
      for (const file of req.files) {
        const tempDir = os.tmpdir();
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        const tempPath = path.join(tempDir, uniqueName);
        fs.writeFileSync(tempPath, file.buffer);
        const uploadResult = await uploadImage(tempPath, 'properties');
        fs.unlinkSync(tempPath);
        imageUrls.push(uploadResult.url);
      }
    }

    propertyData.images = imageUrls;
    propertyData.createdAt = new Date();
    propertyData.updatedAt = new Date();

    const docRef = await db.collection('properties').add(propertyData);
    res.status(201).json({ id: docRef.id, ...propertyData });
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    const id = req.params.id;
    await db.collection('properties').doc(id).update({ ...req.body, updatedAt: new Date() });
    const updated = await db.collection('properties').doc(id).get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    if (!db) return res.status(503).json({ error: 'Firebase not initialized' });
    await db.collection('properties').doc(req.params.id).delete();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};