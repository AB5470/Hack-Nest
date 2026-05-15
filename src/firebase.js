import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCO_fxfxKn-P-9q6S-IUPdt9416WN60gI8",
  authDomain: "hackathon-organizer-4f580.firebaseapp.com",
  projectId: "hackathon-organizer-4f580",
  storageBucket: "hackathon-organizer-4f580.firebasestorage.app",
  messagingSenderId: "126987036364",
  appId: "1:126987036364:web:3948677b10a92163794469",
  measurementId: "G-VH0B62W0WY"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
