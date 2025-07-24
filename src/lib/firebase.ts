// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCICE5w6owhqEoFr55xlYwf4hZcno-txL8",
  authDomain: "amiro-news.firebaseapp.com",
  projectId: "amiro-news",
  storageBucket: "amiro-news.appspot.com",
  messagingSenderId: "849105130428",
  appId: "1:849105130428:web:c549277a3dfcd1860911b9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };
