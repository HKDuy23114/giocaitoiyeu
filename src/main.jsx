import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { getAuth, signInAnonymously } from "firebase/auth";

// login firebase
const auth = getAuth();

signInAnonymously(auth)
    .then(() => {
        console.log("Firebase anonymous login success");
    })
    .catch((error) => {
        console.error(error);
    });

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App />
    </StrictMode>,
)