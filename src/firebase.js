import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAj92tt4f5W3jN_KE4LieQYpkxbl-f1B1o",
  authDomain: "hamcer-24bd9.firebaseapp.com",
  projectId: "hamcer-24bd9",
  storageBucket: "hamcer-24bd9.firebasestorage.app",
  messagingSenderId: "750227956232",
  appId: "1:750227956232:web:dfcc2fc92846bd2ea027bd",
  measurementId: "G-TXMT3ZHVZS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);

export default app;