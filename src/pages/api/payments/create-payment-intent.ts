// src/pages/api/payments/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie"; // To forward cookies if needed for auth

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const cookies = parse(req.headers.cookie || "");
      const accessToken = cookies.access_token; // Forward token if your backend needs it

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/create-checkout-session`,
        {
          // Your NestJS backend URL
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: JSON.stringify(req.body),
        }
      );
      console.log(backendResponse);

      const data = await backendResponse.json();
      console.log(data);

      if (!backendResponse.ok) {
        return res.status(backendResponse.status).json(data);
      }
      return res.status(200).json(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return res
        .status(500)
        .json({ message: "Internal server error", error: errorMessage });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed ");
  }
}
