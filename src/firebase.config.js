import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcN0zgRp10f2eY0_DpHpZPIz5PmVHXSvI",
  authDomain: "real-estate-marketplace-7a91d.firebaseapp.com",
  projectId: "real-estate-marketplace-7a91d",
  storageBucket: "real-estate-marketplace-7a91d.appspot.com",
  messagingSenderId: "230726436275",
  appId: "1:230726436275:web:f520b6c4c22ee8ae99b7c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);