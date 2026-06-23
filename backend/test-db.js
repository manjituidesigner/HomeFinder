require('dotenv').config();
const mongoose = require('mongoose');

const mongoURI = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('Testing connection to:', mongoURI ? 'URI found' : 'URI NOT FOUND');

if (!mongoURI) {
  console.error('Error: No MongoDB URI found in .env');
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => {
    console.log('SUCCESS: Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch(err => {
    console.error('FAILURE: Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
