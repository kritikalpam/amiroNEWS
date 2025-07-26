import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCICE5w6owhqEoFr55xlYwf4hZcno-txL8",
  authDomain: "amiro-news.firebaseapp.com",
  projectId: "amiro-news",
  storageBucket: "amiro-news.firebasestorage.app",
  messagingSenderId: "849105130428",
  appId: "1:849105130428:web:c549277a3dfcd1860911b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
