"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import "tailwindcss/tailwind.css"; // Tailwind setup

type Props = {};

export default function RecyclePage({}: Props) {
  const { data: session } = useSession();
  const [inputValue, setInputValue] = useState("");

  // Combine email and input value for QR data
  const qrData = `${session?.user?.email || ""} - ${inputValue}`;

  return (
    <div className="flex flex-col items-center justify-center h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Recycle Plastic</h1>

      {/* Input for additional information */}
      <input
        type="text"
        placeholder="Introduce the weight ()"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border border-gray-300 p-2 rounded mb-4 w-64"
      />

      {/* QR Code */}
      {qrData && (
        <div className="bg-white p-4 shadow-lg rounded">
          <QRCodeCanvas value={qrData} size={150} />
        </div>
      )}

      {/* Displaying email and input info */}
      <p className="text-sm text-gray-500 mt-2">
        QR Code contains: {session?.user?.email} - {inputValue}
      </p>
    </div>
  );
}
