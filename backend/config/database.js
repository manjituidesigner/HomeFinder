// Database config
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoURI = process.env.MONGODB_URI;

mongoose.set('bufferCommands', false);

mongoose
  .connect(mongoURI, {
    serverSelectionTimeoutMS: 5000,
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    console.error('MongoDB hint: If using Atlas, ensure your IP is whitelisted (Network Access) and the username/password in MONGODB_URI are correct.');
  });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});