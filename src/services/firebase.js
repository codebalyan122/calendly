import firebase from "firebase/compat/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signInWithPopup,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCGAej4MmNQvLeYXZAs1cCnkwsTXq4TQgM",
  authDomain: "calendly-87186.firebaseapp.com",
  projectId: "calendly-87186",
  storageBucket: "calendly-87186.appspot.com",
  messagingSenderId: "878942489475",
  appId: "1:878942489475:web:cacbbdf4a2e75f25b504b6",
  measurementId: "G-XMKRR5S7J3",
};

firebase.initializeApp(firebaseConfig);

export const auth = getAuth(firebase.initializeApp(firebaseConfig));

const provider = new GoogleAuthProvider(firebase.initializeApp(firebaseConfig));

provider.setCustomParameters({ prompt: "select_account" });

export const signInWithGoogle = () => signInWithPopup(auth, provider);

export const createUserWithEmailPassword = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailPassword = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const signOutUser = () => auth.signOut();

export const db = getFirestore(firebase.initializeApp(firebaseConfig));

export const addUserInDatabase = async (uid, data) => {
  try {
    return await setDoc(doc(db, "Users", uid), {
      ...data,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const addEvents = async (uid, newEvent) => {
  try {
    return await setDoc(doc(db, `Users/${uid}/events`, `${newEvent.id}`), {
      ...newEvent,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const updateEvent = async (uid, eventId, newEvent) => {
  try {
    return await updateDoc(doc(db, `Users/${uid}/events`, `${eventId}`), {
      ...newEvent,
      title: newEvent.title,
      start: newEvent.start.toDate(),
      end: newEvent.end.toDate(),
    });
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const getAllEvents = async (uid) => {
  try {
    let userEvents = [];
    await (
      await getDocs(collection(db, `Users/${uid}/events`))
    ).forEach((doc) => {
      userEvents.push({ ...doc.data() });
    });
    return userEvents.reverse();
  } catch (err) {
    console.log("Err: ", err);
  }
};

export const deleteEvent = async (uid, eventId) => {
  await deleteDoc(doc(db, `Users/${uid}/events`, `${eventId}`));
};
