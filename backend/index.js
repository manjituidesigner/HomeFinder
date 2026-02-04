const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database');
// require('./config/firebase'); // Initialize Firebase - commented out as not configured

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

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const tenantRoutes = require('./routes/tenants');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const basePort = Number(process.env.PORT) || 3000;

const listenWithRetry = (port, remainingAttempts) => {
  const server = app.listen(port, () => console.log(`Rently backend listening on ${port}`));
  server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE' && remainingAttempts > 0) {
      server.close(() => listenWithRetry(port + 1, remainingAttempts - 1));
      return;
    }
    throw err;
  });
};

if (require.main === module) {
  listenWithRetry(basePort, 10);
}

module.exports = app;
