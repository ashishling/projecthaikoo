"use client";

import { useState } from 'react';
import { useAuth } from "@/lib/auth/auth-context";
import { NavBar } from "@/components/layout/navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AuthForm } from '@/components/auth/auth-form';

export function LayoutProvider({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <>
      <NavBar
        isLoggedIn={!!user}
        onLoginClick={() => setIsLoginOpen(true)}
        onSignOut={signOut}
      />
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login or Sign Up</DialogTitle>
          </DialogHeader>
          <AuthForm onAuthSuccess={() => setIsLoginOpen(false)} />
        </DialogContent>
      </Dialog>
      {children}
    </>
  );
} 