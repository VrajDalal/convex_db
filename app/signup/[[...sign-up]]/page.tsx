import React from "react";
import { SignUp } from "@clerk/nextjs";


export default function SignUpPage() {
    return (
        <>
            <main className='container'>
                <div className='flex items-start justify-center min-h-screen'>
                    <SignUp />
                </div>
            </main >
        </>
    )
}
