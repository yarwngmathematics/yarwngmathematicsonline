"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export type Role = "student" | "admin";

export interface UserProfile {
  uid: string;
  role: Role;
  name: string;
  email: string;
  whatsapp?: string;
  studentClass?: "Class 10" | "Class 11" | "Class 12";
  board?: string;
  medium?: string;
  schoolName?: string;
  address?: string;
  mode?: "Online" | "Offline";
  paymentPlan?: "monthly" | "annual";
  paymentStatus?: "active" | "due" | "expired";
  paymentDueDate?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  profileError: string | null;
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true, profileError: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setProfileError(null);
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "users", firebaseUser.uid));
          setProfile(snap.exists() ? (snap.data() as UserProfile) : null);
        } catch (err: any) {
          console.error("[Auth] Failed to load profile:", err?.message ?? err);
          setProfile(null);
          setProfileError(err?.message ?? "Failed to load your profile.");
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, profileError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}