// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUy_SoP4qqzu4ObV86lLn3tBNIURImVVM",
  authDomain: "loan-e41f8.firebaseapp.com",
  projectId: "loan-e41f8",
  storageBucket: "loan-e41f8.firebasestorage.app",
  messagingSenderId: "816558677137",
  appId: "1:816558677137:web:9c7a9761330dadfa027330"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const db = getFirestore(app);
const auth = getAuth(app);

// Export the services
export { app, db, auth };

// Export Firebase modules for use in components
export { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  onSnapshot,
  serverTimestamp 
} from "firebase/firestore";

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";