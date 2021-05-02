import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyDYHKzInhCbVJ39R4PdPpyCtnctn8JGA-g",
    authDomain: "booksanta-866c8.firebaseapp.com",
    databaseURL: "https://booksanta-866c8-default-rtdb.firebaseio.com",
    projectId: "booksanta-866c8",
    storageBucket: "booksanta-866c8.appspot.com",
    messagingSenderId: "264243441129",
    appId: "1:264243441129:web:397fad379acaeb62416f78"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore();