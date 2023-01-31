// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth';
import {getStorage} from 'firebase/storage'
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiLJXV_zBwEE9wwLKmcALW7hdnNzqmLtU",
  authDomain: "insta-reels-be0bc.firebaseapp.com",
  projectId: "insta-reels-be0bc",
  storageBucket: "insta-reels-be0bc.appspot.com",
  messagingSenderId: "590544930668",
  appId: "1:590544930668:web:50d4264d12ce8288c11549"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
const storage = getStorage();
const db = getFirestore();

export {auth,storage,db}
export default app;