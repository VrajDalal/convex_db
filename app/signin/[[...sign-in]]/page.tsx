import React from 'react'
import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
    return (
        <>
            <main className='container'>
                <div className='flex items-start justify-center min-h-screen'>
                    <SignIn />
                </div>
            </main>
        </>
    )
}
