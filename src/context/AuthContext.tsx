// ==========================================
// K-Mart AI — Authentication Context
// ==========================================
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserProfile, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<UserProfile | null>;
  register: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  loginWithGoogle: (role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  verifyEmail: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from Firestore with offline resilience
  const fetchUserProfile = useCallback(async (uid: string): Promise<UserProfile | null> => {
    const maxRetries = 2;
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const userDoc = await Promise.race([
          getDoc(doc(db, 'users', uid)),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('Firestore request timed out')), 8000)
          ),
        ]);
        if (userDoc.exists()) {
          return userDoc.data() as UserProfile;
        }
        return null;
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.warn(`[K-Mart] Attempt ${attempt + 1}/${maxRetries + 1} — Failed to fetch user profile: ${errorMsg}`);
        if (attempt < maxRetries) {
          // Wait briefly before retrying
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
    console.error('[K-Mart] Could not fetch user profile after retries. Firestore may be unavailable — make sure the Firestore database is created in the Firebase Console.');
    return null;
  }, []);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  // Email/password login
  const login = async (email: string, password: string): Promise<UserProfile | null> => {
    try {
      setError(null);
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      let profile = await fetchUserProfile(result.user.uid);

      // If no profile exists in Firestore, create one automatically
      if (!profile) {
        const newProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || email,
          displayName: result.user.displayName || email.split('@')[0],
          role: 'consumer',
          photoURL: result.user.photoURL || '',
          phone: result.user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          isVerified: result.user.emailVerified,
          isActive: true,
        };
        await setDoc(doc(db, 'users', result.user.uid), {
          ...newProfile,
          createdAt: serverTimestamp(),
        });
        profile = newProfile;
      }

      setUserProfile(profile);
      return profile;
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register new user
  const register = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      setError(null);
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update display name
      await updateProfile(result.user, { displayName: name });

      // Create user profile in Firestore
      const userProfile: UserProfile = {
        uid: result.user.uid,
        email: email,
        displayName: name,
        role: role,
        photoURL: '',
        phone: '',
        createdAt: new Date().toISOString(),
        isVerified: false,
        isActive: true,
      };

      await setDoc(doc(db, 'users', result.user.uid), {
        ...userProfile,
        createdAt: serverTimestamp(),
      });

      // Create role-specific profile
      if (role === 'farmer') {
        await setDoc(doc(db, 'farmers', result.user.uid), {
          uid: result.user.uid,
          farmName: '',
          address: '',
          district: '',
          state: '',
          crops: [],
          trustScore: 75,
          rating: 0,
          totalSales: 0,
          totalEarnings: 0,
          isVerified: false,
          bio: '',
          experience: 0,
        });
      } else if (role === 'consumer') {
        await setDoc(doc(db, 'consumers', result.user.uid), {
          uid: result.user.uid,
          addresses: [],
          preferredCategories: [],
          defaultAddressIndex: 0,
        });
      }

      setUserProfile(userProfile);

      // Send verification email
      await sendEmailVerification(result.user);
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in
  const loginWithGoogle = async (role?: UserRole) => {
    try {
      setError(null);
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if user profile exists
      const existingProfile = await fetchUserProfile(result.user.uid);
      if (!existingProfile) {
        // New user - create profile
        const selectedRole = role || 'consumer';
        const userProfile: UserProfile = {
          uid: result.user.uid,
          email: result.user.email || '',
          displayName: result.user.displayName || '',
          role: selectedRole,
          photoURL: result.user.photoURL || '',
          phone: result.user.phoneNumber || '',
          createdAt: new Date().toISOString(),
          isVerified: true,
          isActive: true,
        };

        await setDoc(doc(db, 'users', result.user.uid), {
          ...userProfile,
          createdAt: serverTimestamp(),
        });

        if (selectedRole === 'farmer') {
          await setDoc(doc(db, 'farmers', result.user.uid), {
            uid: result.user.uid,
            farmName: '',
            address: '',
            district: '',
            state: '',
            crops: [],
            trustScore: 75,
            rating: 0,
            totalSales: 0,
            totalEarnings: 0,
            isVerified: false,
          });
        } else {
          await setDoc(doc(db, 'consumers', result.user.uid), {
            uid: result.user.uid,
            addresses: [],
            preferredCategories: [],
            defaultAddressIndex: 0,
          });
        }

        setUserProfile(userProfile);
      } else {
        setUserProfile(existingProfile);
      }
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Verify email
  const verifyEmail = async () => {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (err: unknown) {
      const errorMessage = getAuthErrorMessage(err);
      setError(errorMessage);
    }
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        resetPassword,
        verifyEmail,
        clearError,
      }}
    >
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

// Firebase error message mapper
function getAuthErrorMessage(error: unknown): string {
  const err = error as { code?: string };
  switch (err.code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please log in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/operation-not-allowed':
      return 'This login method is currently not available.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Contact support.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please register.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed. Please try again.';
    default:
      return 'An error occurred. Please try again.';
  }
}
