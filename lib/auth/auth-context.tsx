'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '@/lib/types';
import {
  getAllUsers,
  getUserById,
  getUserByEmail,
  saveUser,
  updateUser,
  DEFAULT_ADMIN,
  getPlatformSettings,
  DATA_CHANGED_EVENT,
} from '@/lib/data/store';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string, expectedRole?: UserRole) => Promise<{ success: boolean; error?: string; role?: UserRole }>;
  signup: (username: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (updatedData: Partial<UserProfile>) => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SESSION_USER_ID_KEY = 'truetrace_active_user_id';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSession = () => {
    try {
      // Ensure admin exists in storage
      getAllUsers();

      const activeId = localStorage.getItem(SESSION_USER_ID_KEY);
      if (activeId) {
        const found = getUserById(activeId);
        if (found && found.status !== 'suspended') {
          setUser(found);
        } else {
          localStorage.removeItem(SESSION_USER_ID_KEY);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      console.warn('Auth session loading error', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();

    const handleDataChange = () => {
      loadSession();
    };

    window.addEventListener(DATA_CHANGED_EVENT, handleDataChange);
    return () => window.removeEventListener(DATA_CHANGED_EVENT, handleDataChange);
  }, []);

  const signup = async (
    username: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Check platform settings
    const settings = getPlatformSettings();
    if (!settings.allowRegistration) {
      setIsLoading(false);
      return { success: false, error: 'Registration is currently unavailable. Contact system administrator.' };
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanUsername = username.trim();

    // Check if user already exists
    const existing = getUserByEmail(cleanEmail);
    if (existing) {
      setIsLoading(false);
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUser: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      username: cleanUsername,
      email: cleanEmail,
      role: 'user', // Public signup is ALWAYS standard user
      status: 'active',
      company: 'Enterprise Client',
      createdAt: new Date().toISOString().split('T')[0],
      twoFactorEnabled: false,
      themePreference: settings.defaultTheme,
    };

    saveUser(newUser);
    localStorage.setItem(SESSION_USER_ID_KEY, newUser.id);
    setUser(newUser);
    setIsLoading(false);

    return { success: true };
  };

  const login = async (
    email: string,
    password?: string,
    expectedRole: UserRole = 'user'
  ): Promise<{ success: boolean; error?: string; role?: UserRole }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));

    const cleanEmail = email.trim().toLowerCase();

    // Check for admin login
    if (expectedRole === 'admin') {
      if (cleanEmail === 'admin@truetrace.io' || cleanEmail === 'admin@example.com') {
        const adminUser = getUserByEmail('admin@truetrace.io') || DEFAULT_ADMIN;
        saveUser(adminUser);
        localStorage.setItem(SESSION_USER_ID_KEY, adminUser.id);
        setUser(adminUser);
        setIsLoading(false);
        return { success: true, role: 'admin' };
      }

      // Check if another user has admin role
      const found = getUserByEmail(cleanEmail);
      if (found && found.role === 'admin') {
        if (found.status === 'suspended') {
          setIsLoading(false);
          return { success: false, error: 'Your admin account has been suspended.' };
        }
        localStorage.setItem(SESSION_USER_ID_KEY, found.id);
        setUser(found);
        setIsLoading(false);
        return { success: true, role: 'admin' };
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid admin credentials or unauthorized account type.' };
    }

    // Normal User Login
    let found = getUserByEmail(cleanEmail);

    // If user does not exist yet during demo, create a clean initial user profile for them
    if (!found) {
      const namePart = cleanEmail.split('@')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      found = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        username: capitalized,
        email: cleanEmail,
        role: 'user',
        status: 'active',
        company: 'Standard Workspace',
        createdAt: new Date().toISOString().split('T')[0],
        twoFactorEnabled: false,
        themePreference: 'dark',
      };
      saveUser(found);
    }

    if (found.status === 'suspended') {
      setIsLoading(false);
      return { success: false, error: 'Your account has been suspended. Please contact support.' };
    }

    localStorage.setItem(SESSION_USER_ID_KEY, found.id);
    setUser(found);
    setIsLoading(false);
    return { success: true, role: found.role };
  };

  const logout = () => {
    localStorage.removeItem(SESSION_USER_ID_KEY);
    setUser(null);
  };

  const updateProfile = (updatedData: Partial<UserProfile>) => {
    if (!user) return;
    const updated = updateUser(user.id, updatedData);
    if (updated) {
      setUser(updated);
    }
  };

  const refreshUser = () => {
    loadSession();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
