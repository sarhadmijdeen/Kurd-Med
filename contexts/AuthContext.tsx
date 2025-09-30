

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { initializeApp, getApp, getApps } from 'firebase/app';
// FIX: Switched from a namespace import to named imports to align with the Firebase v9+ modular SDK, which resolves all 'not exported member' errors.
import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    type Auth,
    type User
} from 'firebase/auth';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyACnNl0JpUD-JiXk66XBoXUHlXqeMJcD0o",
  authDomain: "kurd-med-app.firebaseapp.com",
  projectId: "kurd-med-app",
  storageBucket: "kurd-med-app.firebasestorage.app",
  messagingSenderId: "610227206713",
  appId: "1:610227206713:web:a1e96e43472357ad40abe8"
};

const areKeysMissing = firebaseConfig.apiKey.startsWith("YOUR_");

let auth: Auth | undefined;

if (!areKeysMissing) {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
} else {
    console.warn("Firebase config is not set. Authentication will be disabled. Please update the firebaseConfig in contexts/AuthContext.tsx.");
}
// --- End Firebase Configuration ---

interface AuthContextType {
    user: User | null;
    signOut: () => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (areKeysMissing || !auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        if (areKeysMissing || !auth) {
            throw new Error("Firebase is not configured. Please update your Firebase credentials in contexts/AuthContext.tsx.");
        }
        const provider = new GoogleAuthProvider();
        // Use signInWithPopup for sandboxed/iframe environments
        await signInWithPopup(auth, provider);
    };

    const handleSignOut = async () => {
        if (auth) {
            await signOut(auth);
        }
    };

    const value = {
        user,
        signOut: handleSignOut,
        signInWithGoogle,
        loading,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};