"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  const onSignOut = async () => {
    await signOut();
  };

  return (
    <div>
      <h1 className="text-xl">Home Page</h1>
      <p>Logged In as: {session?.user?.email || "none"}</p>
      <div className="space-x-4 m-4">
        <button className="rounded bg-green-400 text-white px-4 py-2 text-lg">
          <Link href="/chats">Show Chats</Link>
        </button>
        <button
          className="rounded bg-red-600 text-white px-4 py-2 text-lg"
          onClick={onSignOut}
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
