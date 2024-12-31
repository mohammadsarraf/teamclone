"use client";
import React from "react";
import Login from "./components/Login";
import { useUser, UserProvider, signOutUser } from "./components/UserContext"; // Import the signOutUser function

// Define the HomePage component properly typed
function HomePage({ signOut }: { signOut: () => void }) {
  const { currentUser } = useUser();

  if (!currentUser) {
    return <Login user={currentUser} />;
  }

  return (
    <div>
      {/* Render the Login component if the user is logged in */}
      <Login user={currentUser} />
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
