import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDob6boj-RlUvu-T_Nvp7T3W7EV8llvZ74',
  authDomain: 'mylib1-97be5.firebaseapp.com',
  projectId: 'mylib1-97be5',
  storageBucket: 'mylib1-97be5.appspot.com',
  messagingSenderId: '433561064315',
  appId: '1:433561064315:web:9a20243deb3f9f7ea2e3de',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
