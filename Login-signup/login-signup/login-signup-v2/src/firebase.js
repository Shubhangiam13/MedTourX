 // Import the functions you need from the SDKs you need
 import { initializeApp } from "firebase/app";
 import {getAuth} from "firebase/auth";
 import {getFirestore} from "firebase/firestore";
 // TODO: Add SDKs for Firebase products that you want to use
 // https://firebase.google.com/docs/web/setup#available-libraries
 
 // Your web app's Firebase configuration
 const firebaseConfig = {
   apiKey: "AIzaSyB_skwPfOylvbHkkBBFQ3q5FpsIu3mnY4k",
   authDomain: "login-auth-13065.firebaseapp.com",
   projectId: "login-auth-13065",
   storageBucket: "login-auth-13065.firebasestorage.app",
   messagingSenderId: "451842663963",
   appId: "1:451842663963:web:0422c04743e68685d43abe"
 };
 
 // Initialize Firebase
 const app = initializeApp(firebaseConfig);
 
 export const auth=getAuth(app);
 export const db=getFirestore(app);