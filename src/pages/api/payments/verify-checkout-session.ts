// src/pages/api/payments/create-payment-intent.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie"; // To forward cookies if needed for auth

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {

      const backendResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/payments/verify-session`,
        {
          // Your NestJS backend URL
          method: "POST",
          body: JSON.stringify(req.body),
        }
      );

      const data = await backendResponse.json();
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
