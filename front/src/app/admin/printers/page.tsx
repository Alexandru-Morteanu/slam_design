"use client";
import RightToLeftPopup from "@/app/comp/RightToLeft";
import React, { useState, useEffect } from "react";
import { supabase } from "@/app/comp/supabase";
import { Orders, Printers } from "../../../../constants/const";
import { useSession } from "next-auth/react";

type Props = {};

export default function page({}: Props) {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [orders, setOrders] = useState<Printers[]>([]);
  async function handleChanges() {
    try {
      const res = await supabase.from("imprimante").select("*");
      if (res.data !== null) {
        setOrders(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    handleChanges();
  }, [session]);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="flex flex-col items-end">
        <button
          onClick={() => {
            setIsOpen(true);
          }}
          className="font-bold text-sm bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          ⨁ Add Printer
        </button>

        {/* Scrollable Table */}
        <div className="w-full mt-4 max-h-56">
          {" "}
          {/* Set max height */}
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {[
                  {
                    title: "ID",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                  {
                    title: "Name",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                  {
                    title: "Status",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                  {
                    title: "CurentOrder",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                  {
                    title: "EstimatedTime",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                  {
                    title: "Speed",
                    className: "py-2 px-4 border-b text-left w-[10%]",
                  },
                ].map((col, index) => (
                  <th key={index} className={col.className}>
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="p-5">
              {orders
                .slice()
                .reverse()
                .map((item) => (
                  <tr key={item.id} className="text-sm">
                    <td className="py-2 px-4 border-b text-left">{item.id}</td>
                    <td className="py-2 px-4 border-b text-left">
                      {item.name}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {item.status ? "Active" : "Inactive"}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {item.curentOrder}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {item.finishTime}
                    </td>
                    <td className="py-2 px-4 border-b text-left">
                      {item.speed}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <RightToLeftPopup
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          refresh={handleChanges}
        />
      </div>
    </div>
  );
}
