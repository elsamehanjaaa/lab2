// pages/_app.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import cookie from "cookie";

import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";
import { useHandleOAuthRedirect } from "@/hooks/useHandleOAuthRedirect";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const excludeHeaderPages = [
    "/admin",
    "/instructor",
    "/404",
    "/learn/[slug]/[courseId]",
  ];
  const excludeFooterPages = ["/admin", "/instructor", "/404"];

  const [user, setUser] = useState<
    { username: string; role: string } | undefined
  >(undefined);

  useHandleOAuthRedirect();
  useEffect(() => {
    const fetchUserFromToken = async () => {
      const res = await fetch("http://localhost:3000/api/me");
      const data = await res.json();
      // if (data.user.statusCode === 401) {
      // }

      setUser(data.user);
    };

    fetchUserFromToken();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!excludeHeaderPages.includes(router.pathname) && <Header user={user} />}
      <div
        className={`flex-grow ${
          excludeHeaderPages.includes(router.pathname) ? "" : "mt-[100px]"
        }`}
      >
        <Component {...pageProps} user={user} />
      </div>
      {!excludeFooterPages.includes(router.pathname) && <Footer />}
    </div>
  );
}
