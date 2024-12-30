'use client';
import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import Login from '../components/Login';
import { useUser, UserProvider, signOutUser } from '../components/UserContext';

// Define a functional Welcome component
const Welcome = ({ signOut }: { signOut: () => void }) => {
    const { currentUser } = useUser();
    const router = useRouter(); // Initialize the router

    const handleSignOut = async () => {
        try {
            await signOut(); // Call the signOut function
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
};

// Default export of Home component
export default function Home() {
    // Ensure signOutUser is typed correctly as a function returning a Promise<void>
    return (
        <UserProvider>
            <Welcome signOut={signOutUser} />
        </UserProvider>
    );
}
