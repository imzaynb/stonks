"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { mate_sc } from "@/lib/fonts";

import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs"
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="flex justify-between items-center px-6 py-2 border-b-2">
      <div className="flex items-center">
        <Link href="/" className={`${mate_sc.className} scroll-m-20 pb-2 text-4xl font-semibold tracking-wide transition-colors first:mt-0`}>Stonks</Link>
        {isSignedIn ? (
          <div className="ml-2">
            <Button variant="link">
              <Link href="/quote">Quote</Link>
            </Button>
            <Button variant="link">
              <Link href="/buy">Buy</Link>
            </Button>
            <Button variant="link">
              <Link href="/sell">Sell</Link>
            </Button>
            <Button variant="link">
              <Link href="/history">History</Link>
            </Button>
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="flex items-center">
        {isSignedIn ? (
          <>
            <div className="mr-2">
              <UserButton afterSignOutUrl="/" />
            </div>
            <ModeToggle />
          </>
        ) : (
          <>
            <div className="mr-2">
              <Button variant="link">
                <SignInButton />
              </Button>
              <Button variant="link">
                <SignUpButton />
              </Button>
            </div>
            <ModeToggle />
          </>
        )}
      </div>
    </header>
  )
}

export default Header;