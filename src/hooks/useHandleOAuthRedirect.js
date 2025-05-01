"use server"
import { fetchUser } from "@/utils/fetchUser";
import { useEffect } from "react";

export function useHandleOAuthRedirect() {
  useEffect(() => {
    async function handleRedirect() {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove "#"
        const params = new URLSearchParams(hash);
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const expires_at = params.get("expires_at");
        const token_type = params.get("token_type");

        document.cookie = `access_token=${access_token}; path=/; Secure; SameSite=Lax`;
        document.cookie = `refresh_token=${refresh_token}; path=/; Secure; SameSite=Lax`;

        await fetchUser();
        if (access_token) {
          
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("expires_at", expires_at ?? "");
          localStorage.setItem("token_type", token_type ?? "");
          
          window.history.replaceState({}, document.title, "/");
          // window.location.href('/')

        }
      }
    }
    handleRedirect();
  }, []);
}
