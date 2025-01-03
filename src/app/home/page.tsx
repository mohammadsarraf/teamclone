"use client";
import { UserProvider } from "../components/UserContext";
import HomeContent from "../utils/edit";

export default function Home() {
  return (
    <UserProvider>
      <HomeContent />
    </UserProvider>
  );
}
