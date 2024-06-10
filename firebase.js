// firebase.ts
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA8luy4li29fRdS7SsshD1FSCiwgcFvRQk",
  authDomain: "reciapp-5cea0.firebaseapp.com",
  projectId: "reciapp-5cea0",
  storageBucket: "reciapp-5cea0.appspot.com",
  messagingSenderId: "173886468225",
  appId: "1:173886468225:web:2d76c28c99ab0f78ccdd80"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
