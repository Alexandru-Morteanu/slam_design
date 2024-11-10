"use client";
import { supabase } from "@/app/comp/supabase";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

type Props = {};

export default function Page({}: Props) {
  const [credit, setCredit] = useState(100);
  const [amount, setAmount] = useState(0);
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [newValue, setNewValue] = useState(0);
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [membership, setMembership] = useState<"FREE" | "PRO" | "PRO MAX">(
    "FREE"
  );
  const { data: session, status } = useSession();

  const [expiryMonth, setExpiryMonth] = useState<string | "">("");
  const [expiryYear, setExpiryYear] = useState<number | "">("");
  const [cvc, setCVC] = useState<string>("");

  const [error, setError] = useState<string>("");

  useEffect(() => {
    getUserSession();
  }, [session]);

  useEffect(() => {
    setNewValue(calculateVirtualBalance(amount));
  }, [amount]);

  useEffect(() => {
    console.log(newValue);
  }, [newValue]);

  async function getUserSession() {
    console.log("Fetched session: ", session);
    try {
      const res = await supabase
        .from("clienti")
        .select("membership")
        .eq("email", session?.user?.email);
      if (res.data) setMembership(res.data[0].membership);
    } catch (error) {
      console.log(error);
    }
  }

  // Fuction to calculate the virtual balance based on membership
  const calculateVirtualBalance = (amount: number): number => {
    let multiplier = 1; // Default for FREE
    if (membership === "PRO") {
      multiplier = 1.5;
    } else if (membership === "PRO MAX") {
      multiplier = 3;
    }
    return parseFloat((amount * multiplier).toFixed(2));
  };

  const handlePayment = async () => {
    setError("");

    if (accountNumber.length !== 16) {
      setError("The card number must have 16 characters.");
      return;
    }
    if (cvc.length !== 3) {
      setError("The CVC must have 3 characters.");
      return;
    }

    alert("Payment processed successfully");
    setCredit((prev: any) => prev + amount);
  };

  const monthOptions = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() + i
  );

  const isCardExpired = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthIndex = monthOptions.indexOf(expiryMonth);
    return (
      (expiryYear && expiryYear < currentYear) ||
      (expiryYear === currentYear &&
        monthIndex > -1 &&
        monthIndex < currentMonth)
    );
  };

  return (
    <div className="flex flex-col items-center p-6 space-y-6 max-w-md mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold">Top Up Your Balance</h2>

      {/* Display Credit Balance */}
      <div className="w-full text-center p-4 rounded bg-gray-100">
        <p className="text-lg font-semibold">
          Current Credit: ${credit.toFixed(2)}
        </p>
      </div>

      {/* Display Error Message */}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Payment Form */}
      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          placeholder="First/Last name"
        />
      </div>

      <div className="w-full">
        <label className="block text-sm font-medium text-gray-700">
          Card Number
        </label>
        <input
          type="text"
          value={routingNumber}
          onChange={(e) => setRoutingNumber(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          placeholder=""
        />
      </div>

      {/* Expiration Date and CVC */}
      <div className="w-full flex space-x-2">
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Expires Month
          </label>
          <select
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Select Month</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">
            Expires Year
          </label>
          <select
            value={expiryYear}
            onChange={(e) => setExpiryYear(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div className="w-1/3">
          <label className="block text-sm font-medium text-gray-700">CVC</label>
          <input
            type="text"
            value={cvc}
            onChange={(e) => setCVC(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
            placeholder=""
            maxLength={3}
          />
        </div>
      </div>

      <div className="w-full mt-4">
        <label className="block text-sm font-medium text-gray-700">
          Amount to Top-Up
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => {
            const newAmount = parseFloat(e.target.value);
            setAmount(newAmount);
            if (!isNaN(newAmount)) {
              const calculatedBalance = calculateVirtualBalance(newAmount);
              setVirtualBalance(calculatedBalance);
            } else {
              setVirtualBalance(0);
            }
          }}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
          placeholder="Enter amount"
        />
        <p className="mt-2 text-gray-700"></p>
        {newValue !== 0 && (
          <div className="text-green-400 w-[100%]">={newValue}</div>
        )}
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={
          !amount ||
          !accountNumber ||
          !routingNumber ||
          !expiryMonth ||
          !expiryYear ||
          !cvc ||
          isCardExpired()
        }
        className="w-full py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
      >
        Pay
      </button>
    </div>
  );
}
