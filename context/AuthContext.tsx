'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getAuth, onAuthStateChanged, User, signOut as firebaseSignOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/firebaseconfig";

initializeApp(firebaseConfig);

interface AuthContextType {
    user: User | null; 
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) { 
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [auth]);

    const signOut = () => firebaseSignOut(auth);

    return (
        <AuthContext.Provider value={{ user, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}