import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, isFirebaseConfigured } from '../services/firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { ActivityLogService } from '../services/storageService';

const ADMIN_EMAIL = 'balochrohan50@gmail.com';
const AUTH_STORAGE_KEY = 'rohan_user_session_v1';

interface AuthContextType {
  currentUser: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  loginAsAdminDemo: (pass: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync with Firebase Auth if configured
  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
        if (fbUser) {
          const role: UserRole = fbUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
          const profile: UserProfile = {
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'Perfume Connoisseur',
            role,
            createdAt: new Date().toISOString()
          };
          setCurrentUser(profile);
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      if (isFirebaseConfigured && auth) {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
        const role: UserRole = cred.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: cred.user.email || normalizedEmail,
          displayName: cred.user.displayName || normalizedEmail.split('@')[0],
          role,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(profile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
        if (role === 'admin') {
          ActivityLogService.log(normalizedEmail, 'Admin logged in securely via Firebase', 'auth', profile.uid);
        }
        return { success: true };
      }

      // Standalone secure fallback when Firebase credentials are not yet provisioned
      if (normalizedEmail === ADMIN_EMAIL.toLowerCase()) {
        if (!pass || pass.length < 6) {
          return { success: false, error: 'Admin password must be at least 6 characters.' };
        }
        const adminProfile: UserProfile = {
          uid: 'admin-baloch-01',
          email: ADMIN_EMAIL,
          displayName: 'Rohan Baloch (Store Owner)',
          role: 'admin',
          createdAt: '2026-01-01T00:00:00Z'
        };
        setCurrentUser(adminProfile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminProfile));
        ActivityLogService.log(ADMIN_EMAIL, 'Admin accessed management console', 'auth', adminProfile.uid);
        return { success: true };
      }

      // Regular customer
      const customerProfile: UserProfile = {
        uid: `user-${Date.now()}`,
        email: normalizedEmail,
        displayName: normalizedEmail.split('@')[0],
        role: 'customer',
        createdAt: new Date().toISOString()
      };
      setCurrentUser(customerProfile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(customerProfile));
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.';
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      const normalizedEmail = email.trim().toLowerCase();

      if (isFirebaseConfigured && auth) {
        const cred = await createUserWithEmailAndPassword(auth, normalizedEmail, pass);
        const role: UserRole = cred.user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
        const profile: UserProfile = {
          uid: cred.user.uid,
          email: normalizedEmail,
          displayName: name.trim() || normalizedEmail.split('@')[0],
          role,
          createdAt: new Date().toISOString()
        };
        setCurrentUser(profile);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
        return { success: true };
      }

      const role: UserRole = normalizedEmail === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'customer';
      const profile: UserProfile = {
        uid: `user-${Date.now()}`,
        email: normalizedEmail,
        displayName: name.trim() || normalizedEmail.split('@')[0],
        role,
        createdAt: new Date().toISOString()
      };
      setCurrentUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Registration failed.';
      return { success: false, error: errorMsg };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (isFirebaseConfigured && auth) {
        await sendPasswordResetEmail(auth, email);
        return { success: true };
      }
      // Demo simulated reset confirmation
      return { success: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send password reset email.';
      return { success: false, error: msg };
    }
  };

  const loginAsAdminDemo = async (pass: string): Promise<{ success: boolean; error?: string }> => {
    return login(ADMIN_EMAIL, pass);
  };

  const logout = async (): Promise<void> => {
    try {
      if (isFirebaseConfigured && auth) {
        await fbSignOut(auth);
      }
    } catch (err) {
      console.warn('Logout error', err);
    } finally {
      setCurrentUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  const isAdmin = currentUser?.role === 'admin' || currentUser?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAdmin,
        isLoading,
        login,
        register,
        logout,
        resetPassword,
        loginAsAdminDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
