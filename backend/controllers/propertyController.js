// Property controller
const mongoose = require('mongoose');
const Property = require('../models/Property');
const { uploadImage } = require('../services/imageService');
const fs = require('fs');
const path = require('path');

const ensureDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      error: 'Database not connected. Please check MONGODB_URI and Atlas IP whitelist, then restart the backend.',
    });
    return false;
  }
  return true;
};

exports.getProperties = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
};

exports.createProperty = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const propertyData = req.body;
    let imageUrls = [];

    // Handle image uploads if files are present
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        // Save file temporarily to upload to Cloudinary
        const tempPath = path.join(__dirname, '../temp', file.originalname);
        fs.writeFileSync(tempPath, file.buffer);

        // Upload to Cloudinary
        const uploadResult = await uploadImage(tempPath, 'properties');

        // Delete temp file
        fs.unlinkSync(tempPath);

        imageUrls.push(uploadResult.url);
      }
    }

    // Add image URLs to property data
    propertyData.images = imageUrls;

    const property = new Property(propertyData);
    await property.save();
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
};

exports.updateProperty = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    if (!ensureDbConnected(res)) return;
    await Property.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
};