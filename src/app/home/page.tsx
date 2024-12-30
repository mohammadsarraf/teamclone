'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Login from '../components/Login';
import { useUser, UserProvider, signOutUser } from '../components/UserContext';

export function HomePage(props: any) {
    const { currentUser } = useUser();
    const router = useRouter(); // Initialize the router

    const handleSignOut = async () => {
        try {
            await props.signOut(); // Call the signOut function
            router.push('/'); // Redirect to the home page after signing out
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    if (!currentUser) {
        return <Login user={currentUser} />;
    }

    return (
        <div>
            <p>Welcome, {currentUser.displayName || currentUser.email}!</p>
            <button className="hover:cursor-pointer" onClick={handleSignOut}>
                Sign out
            </button>
        </div>
    );
}

export default function Home() {
    return (
        <UserProvider>
            <HomePage signOut={signOutUser} />
        </UserProvider>
    );
}
