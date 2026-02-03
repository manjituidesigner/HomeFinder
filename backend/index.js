const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/database');
// require('./config/firebase'); // Initialize Firebase - commented out as not configured

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const propertyRoutes = require('./routes/properties');
const tenantRoutes = require('./routes/tenants');

app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Rently backend listening on ${port}`));
