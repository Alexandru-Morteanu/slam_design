"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

// Ensure that we are using the correct event type for form submission
const LoginPage = () => {
  const { data: session, status } = useSession(); // Session state
  const router = useRouter();

  // Handle Google login
  const handleGoogleLogin = async () => {
    await signIn("google");
  };

  useEffect(() => {
    const checkSession = async () => {
      if (status === "authenticated" && session) {
        console.log("User email:", session.user?.email);
        router.push("/dashboard");
      }
    };

    checkSession();
  }, [session, status, router]);

  return (
    <div className="flex flex-col items-center gap-6 p-5">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-center">Please log in to your account.</p>

      {/* Manual Login Form */}

      {/* CAPTCHA - I am not a robot */}
      {/* <div className="mt-4 flex items-center">
          <input
            type="checkbox"
            id="captcha"
            checked={isRobot}
            onChange={() => setIsRobot(!isRobot)}
            className="mr-2"
          />
          <label htmlFor="captcha" className="text-sm text-gray-700">
            I am not a robot
          </label>
        </div> */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleGoogleLogin}
          className="p-2 text-white bg-gray-400 rounded-lg w-full sm:w-auto"
        >
          Log in with Google
        </button>
      </div>

      <div className="mt-4">
        <p>
          Don't have an account?{" "}
          <Link href="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
