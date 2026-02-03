const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import configs
const admin = require('../config/firebase');
const mongoose = require('mongoose');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rently';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const authRoutes = require('../routes/auth');
const propertyRoutes = require('../routes/properties');
const tenantRoutes = require('../routes/tenants');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);