// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Added Auth
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzLLyt5fZPwXktGAO7758_FxM2EYlCo20",
  authDomain: "maahyu-shero.firebaseapp.com",
  projectId: "maahyu-shero",
  storageBucket: "maahyu-shero.firebasestorage.app",
  messagingSenderId: "255446745534",
  appId: "1:255446745534:web:88dbc54223de4ad47e79ef",
  measurementId: "G-SRXQ7YJ5BH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics (optional)
const analytics = getAnalytics(app);
export const db = getFirestore(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app); 

export default app;