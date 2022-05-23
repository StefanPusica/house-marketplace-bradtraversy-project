import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDIs1s6pdYIVBNFqd_aLgjodDwPuRGR3fE",
  authDomain: "house-marketplace-app-592de.firebaseapp.com",
  projectId: "house-marketplace-app-592de",
  storageBucket: "house-marketplace-app-592de.appspot.com",
  messagingSenderId: "1032554513272",
  appId: "1:1032554513272:web:36f49d9e9e7e13fdbd7e8d"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()