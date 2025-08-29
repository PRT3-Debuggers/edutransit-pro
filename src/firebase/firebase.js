// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore, collection, addDoc,doc,  query, where, getDocs,getDoc,setDoc,updateDoc,deleteDoc,Timestamp} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword,signInWithEmailAndPassword ,signOut,sendPasswordResetEmail} from "firebase/auth";
import {deleteAnyUserFromIDB, getAllStories, getSingleUserFromIDB, saveUserToIDB} from "../lib/db.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: import.meta.env.VITE_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_ID,
    measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
const auth = getAuth(app);

export async function saveDoc(docData, collectionName) {
    try {
        const docRef = await addDoc(collection(db, collectionName), docData);
        // console.log("Story saved with ID: ", docRef.id);
    } catch (error) {
        console.error("Error adding story: ", error);
    }
}

export async function resetPassword(email) {
    const auth = getAuth();

    try {
        await sendPasswordResetEmail(auth, email);
    } catch (error) {
        console.error("Error sending reset email:", error.message);
        throw error;
    }
}

export async function signUpUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await saveUserPlanToFirestore(user.uid,email);
        return user;
    } catch (error) {
        //console.error("Error signing up:", error.code, error.message);
        alert("Sign up failed: " + error.message);
        throw error;
    }
}

export async function getDataAfterUpgrade() {
    try {
        const user = await getSingleUserFromIDB();
        const userPlanInfo = await getUserPlan(user.uid);

        if (userPlanInfo.plan === 'pro') {
            const proExpiresAt = userPlanInfo.pro_expires_at?.toDate(); // Convert Firestore timestamp if it exists
            const now = new Date();

            if (proExpiresAt && now > proExpiresAt) {
                alert('Your Pro subscription has expired, and your stories will not saved online. PLease renew your subscription to continue enjoying Pro features.');
                // Handle expired plan case here, e.g., update user plan or notify them to renew.
                await updateDocument('users', user.uid, {plan: 'free'}); // Revert user to free if necessary
                userPlanInfo.plan = 'free'; // Update locally
            }
        }

        await saveUserToIDB({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            plan: userPlanInfo.plan,
            username: userPlanInfo.username,
            upgradedAt: userPlanInfo.upgradedAt,
            pro_expires_at: userPlanInfo.pro_expires_at,
        });
    }
    catch(error){
        console.error("Error getting data after upgrade:", error);
        alert("Failed to retrieve user data after upgrade: " + error.message);
    }

}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const userPlanInfo = await getUserPlan(user.uid);


        if (userPlanInfo.plan === 'pro') {
            const proExpiresAt = userPlanInfo.pro_expires_at?.toDate(); // Convert Firestore timestamp if it exists
            const now = new Date();

            if (proExpiresAt && now > proExpiresAt) {
                alert('Your Pro subscription has expired, and your stories will not saved online. PLease renew your subscription to continue enjoying Pro features.');
                // Handle expired plan case here, e.g., update user plan or notify them to renew.
                await updateDocument('users', user.uid, {plan: 'free'}); // Revert user to free if necessary
                userPlanInfo.plan = 'free'; // Update locally
            }
        }
        
        await saveUserToIDB({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            plan: userPlanInfo.plan,
            username: userPlanInfo.username,
            upgradedAt: userPlanInfo.upgradedAt,
            pro_expires_at: userPlanInfo.pro_expires_at,
        });
    } catch (error) {
        console.error("Error logging in:", error.code, error.message);
        alert("Login failed: " + error.message);
    }
}

export async function getDocumentsByField(collectionName, fieldName, value) {
    const db = getFirestore();
    const q = query(collection(db, collectionName), where(fieldName, "==", value));

    try {
        const querySnapshot = await getDocs(q);
        const results = [];

        querySnapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });
        });

        // console.log("Documents found:", results);

        return results;
    } catch (error) {
        console.error("Error getting documents:", error);
        throw error;
    }
}

export async function updateDocument(collectionName, docId, updatedData) {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);

    try {
        await updateDoc(docRef, updatedData);
        // console.log("Document updated successfully.");
    } catch (error) {
        console.error("Error updating document:", error);
    }
}

export const logoutUser = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        await deleteAnyUserFromIDB();
        console.log("User signed out successfully.");
    } catch (error) {
        console.error("Error signing out:", error);
    }
};

export async function deleteDocument(collectionName, docId) {
    const db = getFirestore();
    const docRef = doc(db, collectionName, docId);

    try {
        await deleteDoc(docRef);
        console.log("Document deleted successfully.");
    } catch (error) {
        console.error("Error deleted document:", error);
    }
}

