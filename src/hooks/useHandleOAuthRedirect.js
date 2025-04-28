"use client"; // if you are using Next.js 13+

import { useEffect } from "react";

export function useHandleOAuthRedirect() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.location.hash) {
      const hash = window.location.hash.substring(1); // Remove "#"
      const params = new URLSearchParams(hash);

      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");
      const expires_at = params.get("expires_at");
      const token_type = params.get("token_type");

      if (access_token) {
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("expires_at", expires_at);
        localStorage.setItem("token_type", token_type);

        // Clean up URL so it looks normal
        window.history.replaceState({}, document.title, "/");
      }
    }
  }, []);
}
