// Import the necessary Firebase functions from the Firebase SDK
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyD5Ls9GdpJkCQouins26myTNUWLzs07rNw",
  authDomain: "biovault-2fbc6.firebaseapp.com",
  projectId: "biovault-2fbc6",
  storageBucket: "biovault-2fbc6.firebasestorage.app",
  messagingSenderId: "619882261741",
  appId: "1:619882261741:web:906cdbc03ff07a6d6430e4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore, Auth, and Storage
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app); // Firebase Storage

// Export the Firebase services for use in your app
export { auth, db, storage };
