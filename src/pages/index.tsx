import Hero from "@/components/Homepage/Hero";
import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const index = () => {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    const type = params.get("type");

    if (type === "recovery" && access_token && refresh_token) {
      // Send tokens to your NestJS backend
      async function recoverSession() {
        await fetch("http://localhost:5000/auth/recovery-session", {
          method: "POST",
          body: JSON.stringify({ access_token }),
          headers: { "Content-Type": "application/json" },
          credentials: "include", // this is required to accept cookies
        })
          .then(() => {
            router.push("/set-new-password"); // Or wherever your password form is
          })
          .catch(() => {
            alert("Something went wrong");
          });
      }
      recoverSession();
    }
  }, []);
  return (
    <main>
      <Hero />
    </main>
  );
};

export default index;
