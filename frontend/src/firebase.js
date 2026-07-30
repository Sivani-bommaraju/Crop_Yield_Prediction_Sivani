import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCrcH3P-DG-ho9Fj1WoVYy8ytc4XKpF1ag",
  authDomain: "yieldsense-ai-fdcb1.firebaseapp.com",
  projectId: "yieldsense-ai-fdcb1",
  storageBucket: "yieldsense-ai-fdcb1.firebasestorage.app",
  messagingSenderId: "17734093712",
  appId: "1:17734093712:web:3e8a7d406b90524d1bc115",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();