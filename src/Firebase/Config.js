// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
import {getStorage} from 'firebase/storage';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuTIyYOmkBggGABXteaTXaAvoZCN2HeYk",
  authDomain: "hostel-allotment-887d7.firebaseapp.com",
  projectId: "hostel-allotment-887d7",
  storageBucket: "hostel-allotment-887d7.appspot.com",
  messagingSenderId: "468918476727",
  appId: "1:468918476727:web:a9617fac0e43be2a031232"
};

// Initialize Firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app); //Provide service to access and manage the database of firebase

export const storage = getStorage(app);