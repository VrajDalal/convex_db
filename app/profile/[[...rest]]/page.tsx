import React from 'react'
import { UserProfile } from '@clerk/nextjs'

export default function page() {
    return (
        <>
            <main className='container'>
                <div className='flex items-start justify-center min-h-screen'>
                    <UserProfile />
                </div>
            </main>
        </>
    )
}
