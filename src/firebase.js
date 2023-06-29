import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';



const app = firebase.initializeApp({
  apiKey: "AIzaSyDiRUMBSEQ9l8E7XTxe3xH9H_F_3VE-3Mc",

  authDomain: "pinchpromo-project-testing.firebaseapp.com",

  projectId: "pinchpromo-project-testing",

  storageBucket: "pinchpromo-project-testing.appspot.com",

  messagingSenderId: "796945746262",

  appId: "1:796945746262:web:5f47b532fb253fd42c6ef7"

});

export const auth = app.auth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
