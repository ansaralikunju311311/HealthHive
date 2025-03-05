// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsnZcryU2VQTBXxsLjPOguNoWGVFtyWMQ",
  authDomain: "auth-1ee5d.firebaseapp.com",
  projectId: "auth-1ee5d",
  storageBucket: "auth-1ee5d.firebasestorage.app",
  messagingSenderId: "414522490713",
  appId: "1:414522490713:web:ca7e7fe3f1b206ae861648",
  measurementId: "G-QJRTNBKKZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// const analytics = getAnalytics(app);
export default app;