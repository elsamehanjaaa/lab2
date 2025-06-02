// src/pages/_app.tsx (or wherever your _app.tsx is)
import { useEffect } from "react"; // useState might not be needed here anymore
import { useRouter } from "next/router";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import cookie from "cookie"; // Likely not needed directly in _app.tsx anymore

import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";
import { useHandleOAuthRedirect } from "@/hooks/useHandleOAuthRedirect";

import { AuthProvider } from "@/contexts/AuthContext"; // Adjust path as needed
import { CartProvider } from "@/components/ShoppingCart/CartContext";

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

  useHandleOAuthRedirect();

  return (
    <AuthProvider>
      <CartProvider>
        <div className="flex flex-col min-h-screen">
          {!excludeHeaderPages.includes(router.pathname) && <Header />}
          <div
            className={`flex-grow ${
              excludeHeaderPages.includes(router.pathname) ? "" : "mt-[100px]"
            }`}
          >
            <Component {...pageProps} />
          </div>
          {!excludeFooterPages.includes(router.pathname) && <Footer />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
