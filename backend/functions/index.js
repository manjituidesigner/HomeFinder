const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Import configs
const admin = require('../config/firebase');
const mongoose = require('mongoose');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import routes
const authRoutes = require('../routes/auth');
const propertyRoutes = require('../routes/properties');
const tenantRoutes = require('../routes/tenants');

const app = express();

const envOriginsRaw = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || '';
const envOrigins = envOriginsRaw
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const defaultDevOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:19006',
  'http://127.0.0.1:19006',
  'http://localhost:8081',
  'http://127.0.0.1:8081',
];

const allowedOrigins = [...new Set([...envOrigins, ...defaultDevOrigins])];

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);