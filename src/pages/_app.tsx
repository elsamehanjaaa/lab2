import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import cookie from "cookie";

import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";
import { useHandleOAuthRedirect } from "@/hooks/useHandleOAuthRedirect";
import { CartProvider } from "@/components/ShoppingCart/CartContext"; // ✅ import your CartProvider

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const excludeHeaderPages = [
    "/admin",
    "/instructor",
    "/404",
    "/learn/[slug]/[courseId]",
    "/join/instructor",
  ];
  const excludeFooterPages = [
    "/admin",
    "/instructor",
    "/404",
    "/join/instructor",
  ];

  const [user, setUser] = useState<
    { username: string; isTeacher: boolean; email: string } | undefined
  >(undefined);

  useHandleOAuthRedirect();
  useEffect(() => {
    const fetchUserFromToken = async () => {
      const res = await fetch("http://localhost:3000/api/me");
      const data = await res.json();

      setUser(data.user);
    };

    fetchUserFromToken();
  }, []);

  return (
    <CartProvider> {/* ✅ wrap everything inside CartProvider */}
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
    </CartProvider>
  );
}
