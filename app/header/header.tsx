import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export default function Header() {

    return (
        <nav className="border px-1 py-2 font-serif flex items-center justify-between mb-5">
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
