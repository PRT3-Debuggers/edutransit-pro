

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, query, where, getDocs, updateDoc, deleteDoc, Timestamp, serverTimestamp, orderBy } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateEmail as fbUpdateEmail, updatePassword as fbUpdatePassword } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const auth = getAuth(app);


export async function signUpUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        alert("Sign up failed: " + error.message);
        throw error;
    }
}


export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        alert("Login failed: " + error.message);
        throw error;
    }
}


export const logoutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export async function resetPassword(email) {
    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
}


export async function updateEmail(newEmail) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdateEmail(auth.currentUser, newEmail);
}


export async function updatePassword(newPassword) {
    if (!auth.currentUser) throw new Error("No user logged in");
    return await fbUpdatePassword(auth.currentUser, newPassword);
}


export async function saveDoc(docData, collectionName) {
    try {
        await addDoc(collection(db, collectionName), docData);
    } catch (error) {
        console.error("Error adding document: ", error);
        throw error;
    }
}


export async function getDocumentsByField(collectionName, fieldName, value) {
    try {
        const q = query(collection(db, collectionName), where(fieldName, "==", value));
        const querySnapshot = await getDocs(q);
        const results = [];
        querySnapshot.forEach((doc) => results.push({ id: doc.id, ...doc.data() }));
        return results;
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export async function updateDocument(collectionName, docId, updatedData) {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, updatedData);
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}


export async function deleteDocument(collectionName, docId) {
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        console.log("Document deleted successfully.");
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}


export async function saveDriverReview(reviewData) {
    try {
        await addDoc(collection(db, "driver-reviews"), {
            ...reviewData,
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error saving driver review:", error);
        throw error;
    }
}


export async function getDriverReviews(driverId) {
    try {
        const q = query(
            collection(db, "driver-reviews"),
            where("driverId", "==", driverId),
            orderBy("timestamp", "desc")
        );
        const querySnapshot = await getDocs(q);
        const reviews = [];
        querySnapshot.forEach((doc) => reviews.push({ id: doc.id, ...doc.data() }));
        return reviews;
    } catch (error) {
        console.error("Error getting driver reviews:", error);
        throw error;
    }
}
