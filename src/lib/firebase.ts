import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt1qmBEC2yZQeib3ksWj6KM7on6MRIK74",
  authDomain: "pshh-app.firebaseapp.com",
  projectId: "pshh-app",
  storageBucket: "pshh-app.firebasestorage.app",
  messagingSenderId: "639959783898",
  appId: "1:639959783898:web:baa2ccc12b974029a308e3",
  measurementId: "G-SNKLHL1EQ9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
