const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || path.join(__dirname, 'serviceAccountKey.json');

let db;

try {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    db = admin.firestore();
    console.log('Firebase Admin SDK initialized successfully');
  } else {
    console.warn(`WARNING: Firebase serviceAccountKey.json not found at ${serviceAccountPath}. Firebase features will be disabled.`);
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error.message);
}

module.exports = { admin, db };