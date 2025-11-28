import { auth } from './db.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const provider = new GoogleAuthProvider();

export function login() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Logged in:", result.user);
        }).catch((error) => {
            console.error("Login Error:", error);
        });
}

export function logout() {
    signOut(auth).then(() => {
        console.log("Logged out");
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
}

export function monitorAuth(callback) {
    onAuthStateChanged(auth, (user) => {
        callback(user);
    });
}
