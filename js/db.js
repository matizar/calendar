// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyARk-X9WszK_gaANeQ9SVkbO_VKBx0sxkw",
    authDomain: "calendar-99d03.firebaseapp.com",
    projectId: "calendar-99d03",
    storageBucket: "calendar-99d03.firebasestorage.app",
    messagingSenderId: "672497069680",
    appId: "1:672497069680:web:efdc8f79295987c08d8eb5",
    measurementId: "G-52E96W9ZYR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app);
