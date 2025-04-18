// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_BUDGET_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_BUDGET_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_BUDGET_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_BUDGET_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_BUDGET_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_BUDGET_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_BUDGET_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);

export { app, auth, db };
