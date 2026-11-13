import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyANNX5LlSHBiHW6VB0w0sUstiCkcK38XK8",
  authDomain: "wellyandcarey.firebaseapp.com",
  projectId: "wellyandcarey",
  storageBucket: "wellyandcarey.firebasestorage.app",
  messagingSenderId: "33182945882",
  appId: "1:33182945882:web:1ae95db235bbedaf1c7e63",
  measurementId: "G-NJSK75WM8Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

