import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { deleteDoc, doc, getDoc, getFirestore, serverTimestamp, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBQK1cy5yAsiN_RlVgzujnl0vDkI14mQy8',
  authDomain: 'amecatzz.firebaseapp.com',
  projectId: 'amecatzz',
  storageBucket: 'amecatzz.firebasestorage.app',
  messagingSenderId: '432779469154',
  appId: '1:432779469154:web:390e5c5fd58bfefca14c3b',
  measurementId: 'G-0XFRPR3DVH'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const database = getFirestore(app);
const provider = new GoogleAuthProvider();

export function observeAuth(callback) { return onAuthStateChanged(auth, callback); }
export function login() { return signInWithPopup(auth, provider).then((result) => result.user); }
export function logout() { return signOut(auth); }

export async function fetchSettings(uid) {
  const snapshot = await getDoc(doc(database, 'users', uid));
  return snapshot.exists() ? snapshot.data() : null;
}

export function saveSettings(uid, settings) {
  return setDoc(doc(database, 'users', uid), { ...settings, serverUpdatedAt: serverTimestamp() }, { merge: true });
}

export function deleteSettings(uid) { return deleteDoc(doc(database, 'users', uid)); }
