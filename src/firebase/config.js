import { initializeApp } from "firebase/app";
import {
  getAuth,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAJrTFdF8J5MrSg41mHfT0EoG2l5kxCFEo",
  authDomain: "deneyap-project.firebaseapp.com",
  projectId: "deneyap-project",
  storageBucket: "deneyap-project.firebasestorage.app",
  messagingSenderId: "494146148350",
  appId: "1:494146148350:web:d191c4e36f7e3fabc5d2af",
  measurementId: "G-N5P8RWYYLG"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export { auth, db };