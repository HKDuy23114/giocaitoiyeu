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