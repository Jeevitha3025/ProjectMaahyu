import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApvNYML5EJSx1x-_e3JQRhYTqS03AvoRg",
  authDomain: "maahyu-c8d42.firebaseapp.com",
  projectId: "maahyu-c8d42",
  storageBucket: "maahyu-c8d42.firebasestorage.app",
  messagingSenderId: "391847850707",
  appId: "1:391847850707:web:6fcb0ef69c52e8d252da26",
  measurementId: "G-5TZ4DTKGDF"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;