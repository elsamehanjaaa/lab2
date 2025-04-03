import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Header from "@/components/Homepage/Header";
import Footer from "@/components/Homepage/Footer";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <Header />
      <Component {...pageProps} />
      <Footer />
    </div>
  );
}
