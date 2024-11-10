"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
