// pages/_app.js
import { useRouter } from "next/router";
import "@/styles/globals.css";

import type { AppProps } from "next/app";

import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const excludeHeaderFooterPages = ["/admin", "/instructor"];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Conditionally render Header and Footer based on the current page */}
      {!excludeHeaderFooterPages.includes(router.pathname) && <Header />}

      <div className="flex-grow  mt-[100px]">
        <Component {...pageProps} />
      </div>

      {/* Only render Footer if not on the Admin or Instructor pages */}
      {!excludeHeaderFooterPages.includes(router.pathname) && <Footer />}
    </div>
  );
}
