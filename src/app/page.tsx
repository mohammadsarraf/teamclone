'use client'
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import { useUser, UserProvider, signOutUser } from './components/UserContext'; // Import the signOutUser function

// import Navtest from './Components/Navtest';
// import NavApptest from './Components/NavApptest';
// import MainContent from './Components/MainContent';
// import Test from './test/page';
// import Login from './Components/Login';

export function HomePage(porps: any) { // Pass the signOut function as a prop
    const { currentUser } = useUser()

    if (!currentUser) {
        return (
          <Login user={currentUser} />
        )
    }

    return (
        <div>
            {/* <Navtest />
            <MainContent user={currentUser.displayName || currentUser.email} signOut={porps.signOut} /> */}
            <Login user={currentUser} />
        </div>
    );
}

export default function Home() {
    return (
        <UserProvider>
            <HomePage signOut={signOutUser} />
        </UserProvider>
    )
}