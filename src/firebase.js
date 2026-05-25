// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCc6DKW4sPisg2ZN8quvCg_ydhRSnuCx2g",
  authDomain: "hbtu-scorecard.firebaseapp.com",
  projectId: "hbtu-scorecard",
  storageBucket: "hbtu-scorecard.firebasestorage.app",
  messagingSenderId: "423642393836",
  appId: "1:423642393836:web:ac6d4eb427c83fdd7949c9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);