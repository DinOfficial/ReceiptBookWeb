// @ts-ignore
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyArdH1cKIfRyNjrwsWvYKnR3zfsrhIqqbk",
  authDomain: "receipt-book-95606.firebaseapp.com",
  projectId: "receipt-book-95606",
  storageBucket: "receipt-book-95606.firebasestorage.app",
  messagingSenderId: "414108113530",
  appId: "1:414108113530:web:113bafb9d44ddfeab679c3",
  measurementId: "G-7Y1BFHR9NT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;