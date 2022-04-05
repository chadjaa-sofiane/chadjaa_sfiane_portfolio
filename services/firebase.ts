// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0YzkxBJTtCNNVqXMQc7sRkPV2Yn5jQIw",
  authDomain: "softfolio-cccda.firebaseapp.com",
  projectId: "softfolio-cccda",
  storageBucket: "softfolio-cccda.appspot.com",
  messagingSenderId: "1054841022699",
  appId: "1:1054841022699:web:54e3ae1dbcbad276be76ae",
  measurementId: "G-BBZCTVXDWS",
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
