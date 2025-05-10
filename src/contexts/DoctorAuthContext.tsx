
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface DoctorAuthContextType {
  isDoctorAuthenticated: boolean;
  isLoadingAuth: boolean;
  loginDoctor: () => void;
  logoutDoctor: () => void;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

const DOCTOR_AUTH_KEY = 'doctorAuthStatus';

export const DoctorAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isDoctorAuthenticated, setIsDoctorAuthenticated] = useState<boolean>(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // Start with loading true
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    try {
      const storedAuthStatus = localStorage.getItem(DOCTOR_AUTH_KEY);
      if (storedAuthStatus === 'true') {
        setIsDoctorAuthenticated(true);
      } else {
        setIsDoctorAuthenticated(false);
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Fallback if localStorage is not available or errors out
      setIsDoctorAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoadingAuth) {
      if (!isDoctorAuthenticated && pathname !== '/doctor/auth/login' && pathname.startsWith('/doctor')) {
        router.push('/doctor/auth/login');
      } else if (isDoctorAuthenticated && pathname === '/doctor/auth/login') {
        router.push('/doctor');
      }
    }
  }, [isDoctorAuthenticated, isLoadingAuth, pathname, router]);

  const loginDoctor = useCallback(() => {
    try {
      localStorage.setItem(DOCTOR_AUTH_KEY, 'true');
    } catch (error) {
       console.error("Error setting localStorage:", error);
    }
    setIsDoctorAuthenticated(true);
    router.push('/doctor');
  }, [router]);

  const logoutDoctor = useCallback(() => {
    try {
      localStorage.removeItem(DOCTOR_AUTH_KEY);
    } catch (error) {
      console.error("Error removing from localStorage:", error);
    }
    setIsDoctorAuthenticated(false);
    router.push('/doctor/auth/login');
  }, [router]);

  const value = { isDoctorAuthenticated, isLoadingAuth, loginDoctor, logoutDoctor };

  // If loading auth or not authenticated and not on login page, show loader or nothing.
  // This prevents rendering protected content before auth check or redirect.
  if (isLoadingAuth) {
    return <div className="flex items-center justify-center min-h-screen w-full"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }
  
  // If not authenticated and trying to access a protected doctor route, 
  // the useEffect above will redirect. Children rendering is conditional in DoctorLayout.
  // This context provider should always render its children if it's past the initial loading.
  // The protection logic is handled by the consumer (DoctorLayout) or the redirect effect.

  return (
    <DoctorAuthContext.Provider value={value}>
      {children}
    </DoctorAuthContext.Provider>
  );
};

export const useDoctorAuth = () => {
  const context = useContext(DoctorAuthContext);
  if (context === undefined) {
    throw new Error('useDoctorAuth must be used within a DoctorAuthProvider');
  }
  return context;
};
