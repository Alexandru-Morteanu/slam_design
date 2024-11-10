"use client";
import { supabase } from "@/app/comp/supabase";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

export default function Page() {
  const [membership, setMembership] = useState("");
  const { data: session } = useSession();

  // Fetch membership when session is available
  useEffect(() => {
    if (session?.user?.email) {
      const fetchMembership = async () => {
        try {
          const { data } = await supabase
            .from("clienti")
            .select("membership")
            .eq("email", session?.user?.email)
            .single(); // Assuming single result

          if (data?.membership) setMembership(data.membership);
        } catch (error) {
          console.error(error);
        }
      };

      fetchMembership();
    }
  }, [session?.user?.email]); // Only trigger when email changes

  const handleChangeSubscription = async (plan: string) => {
    if (membership === plan) return; // Avoid redundant API call
    setMembership(plan);

    try {
      await supabase
        .from("clienti")
        .update({ membership: plan })
        .eq("email", session?.user?.email);
    } catch (error) {
      console.error(error);
    }
  };

  const plans = [
    {
      label: "FREE",
      price: "0",
      buttonText: membership === "FREE" ? "Active plan" : "Downgrade to free",
      features: [
        "No queue priority",
        "Upload your own STL file",
        "Basic printer",
        "Maximum waiting time to print: 1 week",
      ],
    },
    {
      label: "PRO",
      price: "49.99",
      buttonText: membership === "PRO" ? "Active plan" : "Upgrade to PRO",
      features: [
        "Queue priority +",
        "Upload your own STL file",
        "More advanced printer",
        "Maximum waiting time to print: 1 week",
        "Chat with a 3D designer engineer",
        "Chat with an engineer ≈ 30 minutes",
        "Quality control",
      ],
    },
    {
      label: "Industrial",
      price: "199.99",
      buttonText:
        membership === "Industrial" ? "Active plan" : "Upgrade to Industrial",
      features: [
        "Queue priority ++",
        "Upload your own STL file",
        "Resin printer",
        "Maximum waiting time to print: 3 days",
        "Video call with a 3D designer engineer",
        "Chat with an engineer ≈ 2 hours",
        "Advanced quality control",
      ],
    },
  ];

  return (
    <>
      <div className="pb-3 border-b font-bold">
        Change your subscription plan
      </div>
      <div className="pb-3" />

      <div className="flex justify-between">
        {plans.map((plan) => (
          <div key={plan.label} className="border w-[32%] rounded-lg p-5">
            <div className="border-b">
              <div className="font-bold text-lg">{plan.label}</div>
              <div className="flex items-center">
                <div className="font-bold text-lg">${plan.price}</div>
                <div>/ month</div>
              </div>
              <button
                onClick={() => handleChangeSubscription(plan.label)}
                className={`${
                  membership === plan.label && "font-bold"
                } border rounded-lg p-2 my-4 flex justify-center items-center cursor-pointer text-xs`}
              >
                {plan.buttonText}
              </button>
            </div>
            <div className="py-2">
              {plan.features.map((feature, index) => (
                <div key={index} className="my-2 text-sm">
                  ✓ {feature}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="my-3 p-5 w-[100%] border rounded-lg flex justify-between">
        <div className="w-[30%]">
          <div className="font-bold">ENTERPRISE</div>
          <div>
            For large-scale applications running internet-scale workloads.
          </div>
          <button className="border rounded-lg p-2 my-4 flex justify-center items-center cursor-pointer text-xs">
            Contact Us
          </button>
        </div>
        <div className="w-[30%]">
          {[
            "Only resin printers",
            "Priority over any other order",
            "24/7 Assistance",
          ].map((feature, index) => (
            <div key={index} className="mb-2">
              ✓ {feature}
            </div>
          ))}
        </div>
        <div className="w-[30%]">
          {[
            "Discount depending on quantity",
            "Customized Quality Control",
            "Pre-Production Prototyping for Guaranteed Satisfaction",
          ].map((feature, index) => (
            <div key={index} className="mb-2">
              ✓ {feature}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
