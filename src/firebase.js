import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {getFirestore} from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig_project = {
  apiKey: "AIzaSyAdWAosUpFeG7is3eFtYRs392HwoVoYj04",
  authDomain: "dataacquisitionproject-816fe.firebaseapp.com",
  projectId: "dataacquisitionproject-816fe",
  storageBucket: "dataacquisitionproject-816fe.appspot.com",
  messagingSenderId: "691593622084",
  appId: "1:691593622084:web:63c1f09c60bb28ef0e0211",
  measurementId: "G-NERWC5KV4V"
};

const firebaseConfig_dev = {
  apiKey: "AIzaSyDkZp4AtFoOjQI3lTc7IQOYk-ovhdmADtg",
  authDomain: "dataacquisitiondev.firebaseapp.com",
  projectId: "dataacquisitiondev",
  storageBucket: "dataacquisitiondev.appspot.com",
  messagingSenderId: "138731744713",
  appId: "1:138731744713:web:252142ed7ee5dc97030c18",
  measurementId: "G-SSECZ255SR"
};

export const app = initializeApp(firebaseConfig_project);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);