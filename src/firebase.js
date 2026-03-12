import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyCJ6ecQJGcpf4K4AeiFW4YYpsDZoIaac_Y",
    authDomain: "giocaitoiyeu-a87f8.firebaseapp.com",
    databaseURL: "https://giocaitoiyeu-a87f8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "giocaitoiyeu-a87f8",
    storageBucket: "giocaitoiyeu-a87f8.firebasestorage.app",
    messagingSenderId: "21198947731",
    appId: "1:21198947731:web:e218f03fde5c89f15b9466",
    measurementId: "G-T7HKQMF8HE"
};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);

// import { initializeApp } from "firebase/app";
// import { getDatabase } from "firebase/database";
//
// const firebaseConfig = {
//     apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//     authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//     databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
//     projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//     storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: import.meta.env.VITE_FIREBASE_MSG_ID,
//     appId: import.meta.env.VITE_FIREBASE_APP_ID
// };
//
// const app = initializeApp(firebaseConfig);
//
// export const db = getDatabase(app);