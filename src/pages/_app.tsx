// pages/_app.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";
import { fetchUser } from "@/utils/fetchUser";
import { useHandleOAuthRedirect } from "@/hooks/useHandleOAuthRedirect";
import { setSession } from "@/utils/setSession";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const excludeHeaderPages = [
    "/admin",
    "/instructor",
    "/learn/[slug]/[courseId]",
  ];
  const excludeFooterPages = ["/admin", "/instructor"];

  const [user, setUser] = useState<{ username: string } | undefined>(undefined);

  useHandleOAuthRedirect();
  useEffect(() => {
    const fetchUserFromToken = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        // Check if the cookie is already set
        const hasCookie = document.cookie.includes("access_token");

        if (!hasCookie) {
          await setSession(); // This will set the cookie via API call
        }

        const res = await fetchUser(token);
        if (res) setUser(res);
      }
    };

    fetchUserFromToken();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {!excludeHeaderPages.includes(router.pathname) && <Header user={user} />}
      <div className="flex-grow mt-[100px]">
        <Component {...pageProps} />
      </div>
      {!excludeFooterPages.includes(router.pathname) && <Footer />}
    </div>
  );
}
