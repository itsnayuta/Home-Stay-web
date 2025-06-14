// Import the functions you need from the SDKs you need
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIvDvMxcTPu75Q773mwy7O-0kZ3EM0nvY",
  authDomain: "stayhome-83697.firebaseapp.com",
  projectId: "stayhome-83697",
  storageBucket: "stayhome-83697.firebasestorage.app",
  messagingSenderId: "1046814130280",
  appId: "1:1046814130280:web:36711f96a39317b85b3bdd",
  measurementId: "G-XPQ0ZXN1GM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);  

initializeFirestore(app, {
  // don't throw error if undefined
  ignoreUndefinedProperties: true,
});

// Initialize Cloud Firestore and get a reference to the service
const database = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

export { auth, database, storage };
