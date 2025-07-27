#!/usr/bin/env node

/**
 * Firebase Setup Helper Script
 * 
 * This script helps you configure Firebase for your Hamcer application.
 * Run with: node setup-firebase.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupFirebase() {
  console.log('🔥 Firebase Configuration Setup for Hamcer\n');
  console.log('Please provide your Firebase project configuration:');
  console.log('(You can find these values in Firebase Console > Project Settings > General > Your apps)\n');

  try {
    const apiKey = await question('API Key: ');
    const authDomain = await question('Auth Domain: ');
    const projectId = await question('Project ID: ');
    const storageBucket = await question('Storage Bucket: ');
    const messagingSenderId = await question('Messaging Sender ID: ');
    const appId = await question('App ID: ');

    const firebaseConfig = `import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "${apiKey}",
  authDomain: "${authDomain}",
  projectId: "${projectId}",
  storageBucket: "${storageBucket}",
  messagingSenderId: "${messagingSenderId}",
  appId: "${appId}"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;`;

    const firebasePath = path.join(__dirname, 'src', 'firebase.js');
    fs.writeFileSync(firebasePath, firebaseConfig);

    console.log('\n✅ Firebase configuration updated successfully!');
    console.log('\nNext steps:');
    console.log('1. Enable Authentication in Firebase Console');
    console.log('2. Enable Firestore Database');
    console.log('3. Enable Cloud Storage');
    console.log('4. Deploy security rules: firebase deploy --only firestore:rules,storage');
    console.log('\nYour application is ready to use Firebase! 🚀');

  } catch (error) {
    console.error('❌ Error setting up Firebase:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setupFirebase();
}

module.exports = { setupFirebase };