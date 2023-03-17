// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAtdtJ8aesZSRAmkrI8Ofu2T7vIpkDe_9E",
    authDomain: "remedios-98e3b.firebaseapp.com",
    projectId: "remedios-98e3b",
    storageBucket: "remedios-98e3b.appspot.com",
    messagingSenderId: "333054393292",
    appId: "1:333054393292:web:db224be50b5eac13db3b69",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
