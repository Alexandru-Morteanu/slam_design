"use client";

import Link from "next/link"; // Import Link from Next.js
import React, { useState } from "react";

type Props = {};

export default function Navigation({}: Props) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <nav className="fixed top-0 w-full h-16 bg-blue-900 flex justify-between items-center px-8 shadow-md z-50">
      {/* Logo */}
      <div className="text-2xl font-bold text-white">SLAM</div>

      {/* Navigation Links */}
      <div className="flex flex-1 justify-center space-x-6 text-white">
        {["home", "dashboard", "about", "contact"].map((tab) => (
          <Link
            key={tab}
            href={tab === "home" ? "/" : `/${tab}`} // Verificare pentru "home"
            className={`${
              activeTab === tab
                ? "bg-white text-blue-900 font-bold" // Active tab styles
                : "hover:text-white hover:glow hover:scale-110 hover:bg-blue-600"
            } px-2 py-1 rounded transition-all duration-300`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        ))}
      </div>

      {/* Glow effect style for hover */}
      <style jsx>{`
        .glow {
          text-shadow: 0 0 8px rgba(255, 255, 255, 0.6),
            0 0 16px rgba(255, 255, 255, 0.6);
          transition: text-shadow 0.3s ease-in-out;
        }
      `}</style>
    </nav>
  );
}
