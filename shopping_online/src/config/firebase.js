// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYD09Awis0lAELydVpVE7UdfjM5nvyjVY",
  authDomain: "shopping-online-b24a4.firebaseapp.com",
  projectId: "shopping-online-b24a4",
  databaseURL:
    "https://shopping-online-b24a4-default-rtdb.asia-southeast1.firebasedatabase.app/",
  storageBucket: "shopping-online-b24a4.firebasestorage.app",
  messagingSenderId: "598566957108",
  appId: "1:598566957108:web:7b494ba7bc30bcb8089a61",
  measurementId: "G-CCLHWD53HE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const database = getDatabase();

export { db, database };
