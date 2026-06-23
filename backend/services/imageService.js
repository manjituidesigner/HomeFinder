// Image upload service using Cloudinary
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImage = async (filePath, folder = 'rently') => {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('Cloudinary keys missing! Returning placeholder image.');
      return {
        public_id: 'placeholder_' + Date.now(),
        url: 'https://via.placeholder.com/400x200?text=Property+Image',
      };
    }
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto', 
    });
    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Image upload failed');
  }
};

// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error('Image deletion failed');
  }
};

module.exports = {
  uploadImage,
  deleteImage,
};