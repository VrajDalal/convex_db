import React from "react";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function Header() {
    const { userId } = auth();
    return (
        <nav className="border px-1 py-2 font-serif flex items-center justify-between mb-5">
            <div className="text-sm md:text-base lg:text-lg xl:text-xl uppercase font-semibold ml-1">
                <Link href='/'>
                    Task manage
                </Link>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                {!userId && (
                    <>
                        <Button>
                            <SignInButton />
                        </Button>
                        <Button>
                            <SignUpButton />
                        </Button>
                        {/* <Link href='/signin' className='text-sm md:text-base lg:text-lg xl:text-xl hover:font-semibold'>Sign in</Link>
                        <Link href='/signup' className='text-sm md:text-base lg:text-lg xl:text-xl hover:font-semibold'>Sign up</Link> */}
                    </>
                )}
                {userId && (
                    <>
                        <Button>
                            <Link href='/taskManage' className="text-sm md:text-base lg:text-lg xl:text-xl">Create task</Link>
                        </Button>
                        <UserButton afterSignOutUrl="/" />

                    </>
                )}
            </div>
        </nav>
    );
}
