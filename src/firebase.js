import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAdWAosUpFeG7is3eFtYRs392HwoVoYj04",
  authDomain: "dataacquisitionproject-816fe.firebaseapp.com",
  projectId: "dataacquisitionproject-816fe",
  storageBucket: "dataacquisitionproject-816fe.appspot.com",
  messagingSenderId: "691593622084",
  appId: "1:691593622084:web:63c1f09c60bb28ef0e0211",
  measurementId: "G-NERWC5KV4V"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);