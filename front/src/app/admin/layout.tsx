"use client";
import { SessionProvider, signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    // await supabase.auth.signOut();
    try {
      await signOut({
        callbackUrl: "/login",
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex">
      <div className="bg-gray-100 p-3 rounded-lg shadow-lg h-[calc(100vh-4rem)] w-[130px] fixed">
        <div className="flex flex-col justify-between h-[100%]">
          <div>
            {[
              { id: 1, label: "Dashboard", link: "" },
              { id: 2, label: "Queue", link: "queue" },
              { id: 3, label: "Recycle", link: "recycle" },
              { id: 4, label: "Printers", link: "printers" },
            ].map((button) => (
              <div key={button.id}>
                <Link
                  href={`/admin/${button.link}`}
                  className="text-xl font-bold text-white-gray"
                >
                  <p className="text-sm px-3 py-2 border-white hover:bg-gray-200 font-inter rounded-md transition-colors duration-200 cursor-pointer">
                    {button.label}
                  </p>
                </Link>
              </div>
            ))}
          </div>
          <div>
            <div
              className="text-sm px-3 py-2 border-white hover:bg-gray-200 font-inter rounded-md transition-colors duration-200 cursor-pointer"
              onClick={handleLogout}
            >
              LOG OUT
            </div>
          </div>
        </div>
      </div>
      <div className="ml-[130px] w-[100%] px-10 pt-10">
        <SessionProvider>{children}</SessionProvider>
      </div>
    </div>
  );
}
