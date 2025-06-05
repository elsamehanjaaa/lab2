// pages/api/me.ts
import { parse, serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";

interface User {
  id: string;
  name: string;
  email: string;
  isTeacher?: boolean;
}

interface MeResponse {
  user: User | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeResponse>
) {
  const cookies = parse(req.headers.cookie || "");
  let token = cookies.access_token;
  const refreshToken = cookies.refresh_token;

  // Helper to fetch user info
  const fetchUser = async (accessToken: string) => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      credentials: "include"
    });
    return response;
  };

  let response = token ? await fetchUser(token) : null;

  // If no token or 401, try to refresh
  if (!token || (response && response.status === 401)) {
    if (!refreshToken) return res.status(401).json({ user: null });

    const refreshRes = await fetch(`${API_URL}/auth/refresh-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
      credentials: "include"
    });

    if (!refreshRes.ok) return res.status(401).json({ user: null });

    const data = await refreshRes.json();
    token = data.session.access_token;

    // Set new access token cookie
    res.setHeader(
      "Set-Cookie",
      serialize("access_token", token as string, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 15, // 15 minutes
      })
    );

    // Retry fetching the user
    response = await fetchUser(token as string);
    if (!response.ok) return res.status(401).json({ user: null });
  }

  if (!response) {
    return res.status(401).json({ user: null });
  }
  const user: User = await response.json();
  const fetchTeacherResponse = await fetch(`${API_URL}/teachers/checkUser`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: "include"
  });

  user.isTeacher = await fetchTeacherResponse.json();

  res.status(200).json({ user });
}