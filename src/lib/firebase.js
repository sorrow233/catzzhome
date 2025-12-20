// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBQK1cy5yAsiN_RlVgzujnl0vDkI14mQy8",
    authDomain: "amecatzz.firebaseapp.com",
    projectId: "amecatzz",
    storageBucket: "amecatzz.firebasestorage.app",
    messagingSenderId: "432779469154",
    appId: "1:432779469154:web:390e5c5fd58bfefca14c3b",
    measurementId: "G-0XFRPR3DVH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export const login = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
};

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout failed:", error);
    }
};

/**
 * Save user settings to Cloud
 * @param {string} uid User ID
 * @param {object} data { bg: string, bookmarks: array }
 */
export const saveSettings = async (uid, data) => {
    if (!uid) return;
    try {
        await setDoc(doc(db, "users", uid), data, { merge: true });
    } catch (e) {
        console.error("Error saving settings:", e);
    }
};

/**
 * Listen to user settings changes
 * @param {string} uid 
 * @param {function} callback (data) => void
 */
export const listenSettings = (uid, callback) => {
    if (!uid) return null;
    return onSnapshot(doc(db, "users", uid), (doc) => {
        if (doc.exists()) {
            callback(doc.data());
        }
    });
};

export { auth, onAuthStateChanged };
