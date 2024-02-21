// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu8XKPImPi6YLiPVVA86IjRQJzrPSeIZw",
  authDomain: "creative-studio-7be0d.firebaseapp.com",
  projectId: "creative-studio-7be0d",
  storageBucket: "creative-studio-7be0d.appspot.com",
  messagingSenderId: "371587987596",
  appId: "1:371587987596:web:1d967d4d845053e35423a9"
};

// Initialize Firebase
export const appInitializer = initializeApp(firebaseConfig);