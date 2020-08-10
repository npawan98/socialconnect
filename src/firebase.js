import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDTIDFnOWPzxICnS7pv4XjDXw7MPYZ8YWc",
    authDomain: "socialconnect-2df6b.firebaseapp.com",
    databaseURL: "https://socialconnect-2df6b.firebaseio.com",
    projectId: "socialconnect-2df6b",
    storageBucket: "socialconnect-2df6b.appspot.com",
    messagingSenderId: "182442502825",
    appId: "1:182442502825:web:e5a31b39f914fd520e97b8",
    measurementId: "G-XJKT6NL0HE"

});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db, auth, storage,firebase};