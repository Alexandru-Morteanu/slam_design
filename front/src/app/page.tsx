"use client"; // Ensures the component is treated as a Client Component
import Footer from "@/app/comp/Footer";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import the useRouter hook
import { motion } from "framer-motion"; // Import Framer Motion for animations
import imp1 from "../../public/2.png";
//import Image from "next/image";
type Props = {};

export default function Page({}: Props) {
  const [membership, setMembership] = useState<string>("");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="bg-white text-gray-900 min-h-screen py-16">
      <div className="container mx-auto p-6">
        {/* Welcome Section */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to Our Premium Subscription Service
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Choose the best plan to suit your needs and elevate your experience
            with exclusive features and support.
          </p>
        </motion.section>

        {/* About Us Section */}
        <motion.section
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
          <p className="text-lg text-gray-600 mb-8">
            We are pioneers in the world of 3D printing. Our mission is to
            provide businesses, engineers, and creators with high-quality 3D
            printing services that bring your ideas to life. With
            state-of-the-art technology and expert engineers, we offer fast,
            reliable, and custom solutions for every need.
          </p>
        </motion.section>

        {/* 3D Printer Images Section */}
        <section className="text-center mb-16">
          <motion.h3
            className="text-3xl font-semibold text-gray-800 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Our 3D Printers */}
          </motion.h3>
          <div className="flex justify-center gap-8">
            {/* <Image src={imp1} alt="" />
            <Image src={imp1} alt="" /> */}
          </div>
        </section>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-xl animate-pulse">
            Loading plans...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                className={`p-8 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out ${
                  membership === plan.label
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
                    : "bg-white text-gray-800"
                }`}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <div className="text-2xl font-semibold">{plan.label}</div>
                  <div className="text-xl font-bold text-yellow-600">
                    ${plan.price}
                  </div>
                </div>

                {/* Plan Features */}
                <div className="space-y-3 mb-6">
                  {plan.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 text-yellow-600 mr-2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Plan Images */}
                <motion.div
                  className="relative"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img
                    src="/images/3d-printer.jpg" // Replace with actual path to a 3D printer image
                    alt="3D Printer"
                    className="w-full h-[250px] object-cover rounded-lg mb-6"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg text-white font-bold text-xl">
                    3D Printing Service
                  </div>
                </motion.div>

                {/* Action Button */}
              </motion.div>
            ))}
          </div>
        )}

        {/* Enterprise Section */}
        <motion.div
          className="mt-12 p-8 bg-gray-50 rounded-xl shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-semibold text-center text-blue-600">
            ENTERPRISE
          </h2>
          <p className="text-lg text-center mb-5 text-gray-600">
            For large-scale applications running at internet scale workloads.
          </p>

          <div className="grid grid-cols-1 p-5  mt-10 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="text-xl font-semibold">Features:</div>
              <ul className="space-y-2 text-lg text-gray-600 list-disc pl-6">
                <li>Only resin printers</li>
                <li>Priority over other orders</li>
                <li>24/7 Assistance</li>
              </ul>
            </div>
            <div className="space-y-4">
              <div className="text-xl font-semibold">Additional Benefits:</div>
              <ul className="space-y-2 text-lg text-gray-600 list-disc pl-6">
                <li>Discount depending on quantity</li>
                <li>Customized Quality Control</li>
                <li>Pre-Production Prototyping for Guaranteed Satisfaction</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8"></div>
        </motion.div>
        <div>
          {/* Other content of your page */}

          <Footer />
        </div>
      </div>
    </div>
  );
}
