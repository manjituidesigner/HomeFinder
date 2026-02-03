// Property routes
const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const multer = require('multer');

// Configure multer for memory storage (for Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/', propertyController.getProperties);
router.post('/', upload.array('images', 10), propertyController.createProperty); // Allow up to 10 images
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

module.exports = router;