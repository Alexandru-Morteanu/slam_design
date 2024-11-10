"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { Orders } from "../../../constants/const";
import axiosInstance from "./axiosInstance";
import { buffer } from "stream/consumers";

type Props = {
  isOpen: boolean;
  setIsOpen: Function;
  refresh: Function;
};

export default function RightToLeftPopup({
  isOpen,
  setIsOpen,
  refresh,
}: Props) {
  const { data: session, status } = useSession();
  // const [done, setDone] = useState<boolean>(false);
  const [order, setOrder] = useState<Orders>({
    email: "",
    membership: "",
    adress: "",
    est_time: "2h",
    est_price: 50,
    timestamp: 0,
    status: "Waiting...",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  async function handleOrder() {
    try {
      pushImageToBack();
      const res = await supabase
        .from("clienti")
        .select("membership")
        .eq("email", session?.user?.email);
      if (res.data !== null) {
        setOrder((old_value) => ({
          ...old_value,
          email: session?.user?.email || "",
          membership: res.data[0].membership,
          timestamp: Date.now(),
        }));
      }
      refresh();
    } catch (error) {
      console.log(error);
    }
  }

  async function pushImageToBack() {
    const file = selectedFile ?? null;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = async () => {
        try {
          if (!reader.result) return;

          // Remove data:image/jpeg;base64, prefix
          const base64Data = reader.result
            .toString()
            .replace(/^data:image\/jpeg;base64,/, "");
          const binaryData = atob(base64Data);
          const uint8Array = new Uint8Array(binaryData.length);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }

          console.log(uint8Array.buffer);
          const res = await axiosInstance.post("/", {
            buffer: Array.from(uint8Array) as number[],
          });

          console.log("Response:", res.data);
        } catch (error) {
          console.error("Error:", error);
        }
      };
    }
  }

  async function insertOrder() {
    try {
      const res = await supabase.from("orders").insert([order]);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    if (order.timestamp !== 0) insertOrder();
  }, [order.timestamp]);

  return (
    <div className="relative h-screen flex items-center justify-center">
      <div
        className={`fixed top-0 right-0 h-full w-[500px] bg-white shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-10">
          <button
            onClick={togglePopup}
            className="text-gray-500 hover:text-gray-800 mb-4"
          >
            Close
          </button>
          <h2 className="text-xl font-bold mb-2">Create Order</h2>
          <p>Bring your creativity to life.</p>

          <div className="mt-4">
            {/* File Upload */}
            <div className="mb-4">
              <label
                className="block text-sm font-bold text-gray-700"
                htmlFor="file"
              >
                Upload STL File:
              </label>
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="mt-1 p-2 w-full border rounded-md"
              />
            </div>

            {/* Address Input */}
            <div className="mb-4">
              <label
                className="block text-sm font-bold text-gray-700"
                htmlFor="address"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                value={order.adress}
                onChange={(e) => {
                  setOrder((old_value) => ({
                    ...old_value,
                    adress: e.target.value,
                  }));
                }}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>

            <div className="block text-sm font-bold text-gray-700">
              Estimated Time:
            </div>

            <div className="block text-sm font-bold text-gray-700">
              Estimated Cost:
            </div>

            {/* Submit Button */}
            <div className="mt-6 flex gap-4">
              <div
                onClick={handleOrder}
                className="p-2 text-white bg-blue-500 rounded-lg w-full sm:w-auto cursor-pointer"
              >
                Submit Order
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
