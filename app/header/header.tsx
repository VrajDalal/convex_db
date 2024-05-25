'use client'

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";


export default function Header() {

    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return (
        <nav className={`sticky top-0 z-50 border-2 px-1 py-2 font-serif flex items-center justify-between mb-5 bg-white bg-opacity-70 transition ${isScrolled ? 'backdrop-blur-md' : 'backdrop-blur-none'}`}>
            <div className="text-sm md:text-base lg:text-lg xl:text-xl uppercase font-semibold ml-1">
                <Link href='/'>
                    Task manage
                </Link>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                <SignedOut>
                    <Button>
                        <SignInButton />
                    </Button>
                    <Button>
                        <SignUpButton />
                    </Button>
                </SignedOut>
                <SignedIn>
                    <Button>
                        <Link href='/taskManage' className="text-sm md:text-base lg:text-lg xl:text-xl">Create task</Link>
                    </Button>
                    <UserButton afterSignOutUrl="/" />
                </SignedIn>
            </div>
        </nav>
    );
}
