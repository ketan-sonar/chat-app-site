"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignInPage() {
  const onSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/",
      redirect: false,
    });
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="container w-2/3 max-w-md h-1/3 max-h-64 bg-sky-50 rounded flex flex-col justify-center items-center">
        <h1 className="text-center text-3xl my-2">Sign In</h1>
        <hr className="w-2/3 my-2" />
        <button
          className="rounded border border-blue-500 px-4 py-2 my-2 flex justify-center items-center text-blue-500 text-xl"
          onClick={onSignIn}
        >
          <Image
            className="mr-2"
            src="/google.svg"
            alt="Google Logo"
            width={24}
            height={24}
          />
          Sign In with Google
        </button>
      </div>
    </div>
  );
}
