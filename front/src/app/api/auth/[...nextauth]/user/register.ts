// pages/api/user/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/app/comp/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email, username, phoneNumber } = req.body;

  if (!email || !username || !phoneNumber) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const { data, error } = await supabase
    .from("clienti")
    .update({ username: username, phoneNumber: phoneNumber })
    .eq("email", email);
  console.log(data);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ success: true, data });
}
