"use client";

import { ClerkProvider, useUser } from '@clerk/nextjs';
import { useEffect } from 'react';

function UserSetup() {
  const { user, isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Automatically create user profile in database
      fetch('/api/auth/setup-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        if (data._id) {
          console.log('✅ User profile created/verified:', data._id);
        }
      })
      .catch(error => {
        console.error('❌ Error setting up user profile:', error);
      });
    }
  }, [isLoaded, isSignedIn, user]);

  return null;
}

export default function ClerkProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: 'bg-primary text-primary-foreground hover:bg-primary/90',
          card: 'bg-background border border-border',
          headerTitle: 'text-foreground',
          headerSubtitle: 'text-muted-foreground',
          socialButtonsBlockButton: 'bg-background border border-border text-foreground hover:bg-accent',
          formFieldLabel: 'text-foreground',
          formFieldInput: 'bg-background border border-border text-foreground',
          footerActionLink: 'text-primary hover:text-primary/90',
        },
      }}
    >
      <UserSetup />
      {children}
    </ClerkProvider>
  );
}
