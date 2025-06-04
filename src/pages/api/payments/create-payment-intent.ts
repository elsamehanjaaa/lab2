import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const cookies = parse(req.headers.cookie || "");
      const accessToken = cookies.access_token;

      console.log("Request body:", req.body);

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: JSON.stringify(req.body),
        }
      );

      let data;
      try {
        data = await backendResponse.json();
      } catch (jsonError) {
        return res.status(500).json({ message: "Invalid JSON from backend" });
      }

      if (!backendResponse.ok) {
        return res.status(backendResponse.status).json(data);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in create-payment-intent:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
