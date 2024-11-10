"use client";
import { signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import Image from "next/image";
import { supabase } from "../comp/supabase";
import { motion } from "framer-motion"; // Import framer-motion

type Total_client = {
  topUp: number;
  totalOrders: number;
  totalRecycled: number;
  totalPrintTime: number;
};

export default function DashboardPage() {
  const chartData = [
    { month: "January", recycled: 0, new: 100 },
    { month: "February", recycled: 4, new: 96 },
    { month: "March", recycled: 23, new: 67 },
    { month: "April", recycled: 40, new: 60 },
    { month: "May", recycled: 70, new: 30 },
    { month: "June", recycled: 95, new: 5 },
  ];

  const chartConfig = {
    recycled: {
      label: "Recycled",
      color: "#77ffaf",
    },
    new: {
      label: "New",
      color: "#aa1e1a",
    },
  } satisfies ChartConfig;

  const router = useRouter();
  const { data: session, status } = useSession();

  const [stats, setStats] = useState<Total_client>({
    topUp: 0,
    totalOrders: 0,
    totalRecycled: 0,
    totalPrintTime: 0,
  });

  const [orders, setOrders] = useState<Number>();

  useEffect(() => {
    const checkSession = async () => {
      if (status === "authenticated" && session) {
        // Nothing
      } else if (status === "loading" && session) {
      } else {
        // Redirect to login page if the user is not authenticated
        // router.push("/login");
      }
    };
    checkSession();
  }, [session, status, router]);

  // Fetch data from supabase
  async function refresh() {
    try {
      const res1 = await supabase
        .from("clienti")
        .select("*")
        .eq("email", session?.user?.email);

      const res = await supabase
        .from("orders")
        .select("*")
        .eq("email", session?.user?.email);

      if (res1.data)
        setStats((prev_state) => ({
          ...prev_state,
          topUp: res1.data[0]?.credits || "",
          totalOrders: res.data?.length ?? prev_state.totalOrders,
          totalPrintTime:
            res.data?.reduce((acc, order) => acc + (order.est_time || 0), 0) ??
            0,
          totalRecycled: res1.data[0]?.recycled || 0,
        }));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    refresh();
  }, [session]);

  return (
    <motion.div
      className="flex flex-col gap-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="flex justify-between w-[100%] gap-0">
        {[
          {
            id: 1,
            label: "Total Credit",
            emoji: "$",
            color: "green",
            number: `$${stats.topUp}`,
            under: "Amount credited after recent top-ups",
          },
          {
            id: 2,
            label: "Total Orders",
            emoji: "⛟",
            color: `green`,
            number: `${stats.totalOrders}`,
            under: "Orders processed through the platform",
          },
          {
            id: 3,
            label: "Total Recycled",
            emoji: "♺",
            color: "black",
            number: `${stats.totalRecycled / 1000} k`,
            under: "Items processed and recycled",
          },
          {
            id: 4,
            label: "Total Print Time",
            emoji: "⏱",
            color: "red",
            number: `${stats.totalPrintTime}h`,
            under: "Total machine usage time for printing",
          },
        ].map((item) => (
          <motion.div
            key={item.id}
            className="border p-5 rounded-lg w-[23%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <div>
              <div className="flex justify-between font-bold text-lg">
                <div>{item.label}</div>
                <div
                  style={{
                    color: item.color,
                  }}
                >
                  {item.emoji}
                </div>
              </div>
              <div className="font-bold text-lg">{item.number}</div>
              <div className="text-sm text-gray-600">{item.under}</div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex h-[100%] justify-between">
        <motion.div
          className="border p-5 rounded-lg w-[65%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <div className="pb-8">
            <div className="font-bold text-lg">Transactions</div>
            <div className="text-sm text-gray-600">
              Recent transactions from the last 7 days
            </div>
          </div>

          <ChartContainer config={chartConfig} className="h-[85%] w-full">
            <LineChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value: any) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Line
                type="monotone"
                dataKey="recycled"
                stroke="var(--color-recycled)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="new"
                stroke="var(--color-new)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </motion.div>

        <motion.div
          className="border p-5 rounded-lg w-[32%]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 1 }}
        >
          <div className="font-bold text-lg">Recent Order</div>
          {[
            {
              id: 1,
              name: "Primul proiect",
              pret: "314",
            },
            {
              id: 2,
              name: "Al doilea proiect",
              pret: "244",
            },
            {
              id: 3,
              name: "Al treilea proiect",
              pret: "14",
            },
          ]
            .reverse()
            .map((item) => (
              <motion.div
                key={item.id}
                className="flex justify-between items-center py-3 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
              >
                <div className="flex items-center gap-1">
                  {/* <Image src={user} alt="" className="w-6 h-6" /> */}
                  <div>{item.name}</div>
                </div>
                <div>${item.pret}</div>
              </motion.div>
            ))}
        </motion.div>
      </div>
    </motion.div>
  );
}
