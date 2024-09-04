// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

import 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FB_KEY,
    authDomain: 'chat-8d7b2.firebaseapp.com',
    projectId: 'chat-8d7b2',
    storageBucket: 'chat-8d7b2.appspot.com',
    messagingSenderId: '1000952675894',
    appId: '1:1000952675894:web:a0e4c94b53387db5b3a297',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
