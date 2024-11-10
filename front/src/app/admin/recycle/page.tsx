"use client";
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { supabase } from "@/app/comp/supabase";
import { useSession } from "next-auth/react";

type Props = {
  email: string;
  grams: string;
};

const QrScanner: React.FC = () => {
  const { data: session } = useSession();
  const [scanResult, setScanResult] = useState<Props>({
    email: "",
    grams: "",
  });
  useEffect(() => {
    handleUpdate();
  }, [session]);

  useEffect(() => {
    // Initialize html5-qrcode scanner
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10, // Frames per second for scanning
        qrbox: { width: 250, height: 250 }, // Define scanner box dimensions
      },
      false // Disable verbose mode
    );

    // Start scanning for QR codes
    scanner.render(
      (result: any) => {
        // Handle successful scan and set the result
        const [email, grams] = result.toString().split(" - ");

        setScanResult({ email, grams });
        // scanner.clear(); // Stop scanning once a QR code is found
      },
      (error: any) => {
        // Optional: Handle scan errors here
        // console.warn(error);
      }
    );

    // Cleanup on component unmount
    return () => {
      scanner.clear();
    };
  }, []);

  const handleUpdate = async () => {
    try {
      const creditsToAdd = parseFloat(scanResult.grams) * 0.01;
      const res = await supabase
        .from("clienti")
        .select("*")
        .eq("email", session?.user?.email);

      if (res.data) {
        res.data[0].recycled += parseFloat(scanResult.grams);
        const res1 = await supabase
          .from("clienti")
          .update({
            credits: Number(creditsToAdd + res.data[0].credits),
            recycled: res.data[0].recycled,
          })
          .eq("email", session?.user?.email);
        console.log(res1.data);
      }

      setScanResult({ email: "", grams: "" });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div id="qr-reader" className="w-[300px]" />

      {scanResult && (
        <div className="bg-white p-4 rounded-lg mt-4">
          <div className="flex gap-4">
            <div>{scanResult.email}</div>
            <div>{scanResult.grams}g</div>
            <button onClick={handleUpdate} className="text-green-500">
              ✓
            </button>
            <button
              onClick={() => setScanResult({ email: "", grams: "" })}
              className="text-red-500"
            >
              x
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
