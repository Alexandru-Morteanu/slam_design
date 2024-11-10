"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react"; // Import signOut function
import { RegisterForm } from "../../../constants/const";
import axios from "axios";
import { supabase } from "../comp/supabase";

export default function RegisterPage() {
  const [registerForm, setregisterForm] = useState<RegisterForm>({
    username: "",
    phoneNumber: "",
  });
  const { data: session, status } = useSession(); // Session state
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      if (status === "authenticated" && session && session.user) {
        // Type guard check
        console.log("User email:", session.user.email);

        const storedRegisterForm = localStorage.getItem("registerForm");
        console.log(storedRegisterForm);
        if (storedRegisterForm) {
          const formData = JSON.parse(storedRegisterForm);
          const res = await supabase
            .from("clienti")
            .update({
              username: formData.username,
              phoneNumber: formData.phoneNumber,
            })
            .eq("email", session.user.email);
          console.log(res);

          localStorage.removeItem("registerForm");
          router.push("/dashboard");
        }
      }
    };

    checkSession();
  }, [session, status, router]);

  const handleGoogleLogin = async () => {
    console.log("sub");
    localStorage.setItem("registerForm", JSON.stringify(registerForm));
    await signIn("google");
  };

  return (
    <div className="flex flex-col items-center gap-6 p-5">
      <h1 className="text-2xl font-bold">Register</h1>
      <p className="text-center">Create a new account to get started.</p>

      {/* Registration Form */}
      <div className="mt-6 w-full max-w-sm">
        <div>
          <label
            htmlFor="username"
            className="block text-sm font-bold text-gray-700"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={registerForm.username}
            onChange={(e) =>
              setregisterForm((prevForm) => ({
                ...prevForm,
                username: e.target.value,
              }))
            }
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mt-4">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-bold text-gray-700"
          >
            Phone Number:
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={registerForm.phoneNumber}
            onChange={(e) =>
              setregisterForm((prevForm) => ({
                ...prevForm,
                phoneNumber: e.target.value,
              }))
            }
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>

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
            className="p-2 text-white bg-gray-500 rounded-lg w-full sm:w-auto"
          >
            Google
          </button>
        </div>
      </div>

      {/* Link to Login Page */}
      <div className="mt-4">
        <p>
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
