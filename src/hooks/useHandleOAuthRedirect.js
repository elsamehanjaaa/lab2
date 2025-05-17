"use server"
import * as authUtils from "@/utils/auth";
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

        await authUtils.setSession(access_token,refresh_token);
        if (access_token) {
          
          window.history.replaceState({}, document.title, "/");

        }
      }
    }
    handleRedirect();
  }, []);
}
