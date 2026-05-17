import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSuWWt-sD6hQxQjKYj-G0SqdUjlbASPm0",
  authDomain: "yarwng-mathematics01.firebaseapp.com",
  projectId: "yarwng-mathematics01",
  storageBucket: "yarwng-mathematics01.firebasestorage.app",
  messagingSenderId: "699931202912",
  appId: "1:699931202912:web:e8a6a09627775d86a6ba05",
  measurementId: "G-5GCZRVFH68"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
