const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const path = require('path');
const fs = require('fs');

let db = null;
let isConnected = false;

/**
 * Initialize Firebase Admin SDK using serviceAccountKey.json or environment variables
 */
const initFirebase = () => {
  if (admin.getApps().length > 0) {
    db = getFirestore();
    isConnected = true;
    return db;
  }

  try {
    const customPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
    const resolvedPath = customPath
      ? (path.isAbsolute(customPath) ? customPath : path.resolve(__dirname, '..', customPath))
      : path.resolve(__dirname, '..', 'serviceAccountKey.json');

    // Method 1: Check for serviceAccountKey.json file
    if (fs.existsSync(resolvedPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(resolvedPath, 'utf8'));
      if (serviceAccount.project_id && serviceAccount.private_key) {
        admin.initializeApp({
          credential: admin.cert(serviceAccount)
        });
        db = getFirestore();
        isConnected = true;
        console.log(`🔥 Firebase Admin SDK Initialized Successfully`);
        console.log(`📦 Firestore Connected (Project: ${serviceAccount.project_id})`);
        return db;
      }
    }

    // Method 2: Check for direct environment variables
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
      admin.initializeApp({
        credential: admin.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      db = getFirestore();
      isConnected = true;
      console.log(`🔥 Firebase Admin SDK Initialized from Environment Variables`);
      console.log(`📦 Firestore Connected (Project: ${process.env.FIREBASE_PROJECT_ID})`);
      return db;
    }

    console.warn(`⚠️  Firebase Firestore Notice: No serviceAccountKey.json found.`);
    console.warn(`   Target path checked: ${resolvedPath}`);
    console.warn(`   Tip: Download your Service Account Key from Firebase Console:`);
    console.warn(`   Project Settings -> Service accounts -> Generate new private key`);
    console.warn(`   Save it as 'backend/serviceAccountKey.json' (or see serviceAccountKey.json.example).`);
    console.warn(`   The server will fall back to local resilient storage until configured.\n`);
  } catch (error) {
    console.error(`❌ Firebase initialization error: ${error.message}`);
  }

  return null;
};

const getDb = () => {
  if (!db) {
    initFirebase();
  }
  return db;
};

const isFirebaseConnected = () => {
  return isConnected && db !== null;
};

module.exports = {
  initFirebase,
  getDb,
  isFirebaseConnected,
  admin
};
