"use client";

import Header from '@/components/header'
import StonksTable from '@/components/stonks-table'
import { Button } from '@/components/ui/button';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';
import { useState } from 'react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <>
      {!isLoaded ? (
        <></>
      ) : (
        <main>
          <div className='container mt-8 flex justify-center'>
            {isSignedIn ? (
              <StonksTable />
            ) : (
              <div className='flex-col justify-center space-y-4'>
                <div className="leading-7 [&:not(:first-child)]:mt-6">
                  Sign in or sign up to access your trades!
                </div>
                <div className='flex justify-center space-x-3'>
                  <Button variant='outline'>
                    <SignInButton />
                  </Button>
                  <Button variant='outline'>
                    <SignUpButton />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </>
  )
}
