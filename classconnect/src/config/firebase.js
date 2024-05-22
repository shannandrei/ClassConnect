import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
import {getStorage, ref, uploadBytes, getDownloadURL} from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID

    // apiKey: "AIzaSyAOfLRAvDaCWD2lQ22wdnpMwUI3JP94ZhU",
    // authDomain: "campus-eats-7db76.firebaseapp.com",
    // projectId: "campus-eats-7db76",
    // storageBucket: "campus-eats-7db76.appspot.com",
    // messagingSenderId: "791957102382",
    // appId: "1:791957102382:web:1264b332d3f9cc86f264bf",
    // measurementId: "G-3GJ59R641L",
    // databaseURL: "https://campus-eats-7db76-default-rtdb.firebaseio.com"
});


export const auth = getAuth(app);
const storage = getStorage(app);
export const db = getFirestore(app);
export default app;


export async function upload(file, currentUser, setLoading){
    const fileRef = ref(storage, `profile-pictures/${currentUser.uid}.png`);
    setLoading(true);
    const snapshot = await uploadBytes(fileRef, file);

    const photoURL = await getDownloadURL(snapshot.ref);
    updateProfile(currentUser, {photoURL})
    setLoading(false);
    console.log("File uploaded successfully");
}
