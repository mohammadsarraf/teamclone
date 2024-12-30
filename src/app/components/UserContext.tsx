'use client'
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore} from 'firebase/firestore';
import { getAuth, signOut, updateProfile, signInWithEmailAndPassword, onAuthStateChanged, User as FirebaseUser, } from 'firebase/auth';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';


const firebaseConfig = {
    apiKey: "AIzaSyCSlmOX-6AbFI-YIDLzmyDL4WXFVpyT2i4",
    authDomain: "teamclone-cd356.firebaseapp.com",
    projectId: "teamclone-cd356",
    storageBucket: "teamclone-cd356.firebasestorage.app",
    messagingSenderId: "423064596545",
    appId: "1:423064596545:web:9b549ce43726012c5496c0",
    measurementId: "G-YYM2JVLV8M"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

interface UserContextType {
    currentUser: FirebaseUser | null;
}

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
};

export const signInUser = async (username: any, password: any) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const user = userCredential.user;

        // Set the username in the user object
        await updateProfile(user, { displayName: username });

        return { success: true };
    } catch (error) {
        console.error('Login failed', error);
        return { success: false, error: (error as any).message };
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Logout failed', error);
        return { success: false, error: (error as any).message };
    }
};

export const setupAuthListener = (callback: any) => {
    return onAuthStateChanged(auth, callback);
};

export const UserProvider = ({ children }:any) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = setupAuthListener((user: any) => {
            setCurrentUser(user);
        });

        // Cleanup the listener when the component unmounts
        return () => unsubscribe();
    }, []);

    return (
        <UserContext.Provider value={{ currentUser }}>
            {children}
        </UserContext.Provider>
    );
};