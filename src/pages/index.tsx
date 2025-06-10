// pages/index.tsx (or your equivalent file)
import Hero from "@/components/Homepage/Hero";
import React, { useEffect } from "react"; // useState is not used in this snippet
import { useRouter } from "next/router";
import * as authUtils from "@/utils/auth";
import { useModalStore } from "@/stores/modalStore";

const IndexPage = () => {
  // Renamed to PascalCase for convention
  const router = useRouter();
  const { setShowLogin, closeAllModals } = useModalStore(); // Added closeAllModals for good practice

  useEffect(() => {
    // This effect runs once on mount due to the empty dependency array.
    // Ensure router.isReady if accessing query params that might not be available immediately on initial render.

    const handleUrlParams = async () => {
      // --- Handle Hash Parameters (for recovery flow) ---
      if (window.location.hash) {
        const hash = window.location.hash.substring(1); // Remove the '#'
        const hashParams = new URLSearchParams(hash);

        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        if (type === "recovery" && access_token /* && refresh_token */) {
          try {
            await authUtils.recoverSession(); // Adjust if it needs tokens passed
            router.push("/set-new-password"); // Or wherever your password form is
          } catch (error) {
            console.error("Recovery session error:", error);
            alert(
              "Something went wrong with password recovery. Please try again."
            );
          }
          // Clear the hash to prevent re-processing if the user stays on the page
          // or add more specific logic to ensure this runs only once.
          window.location.hash = "";
          return; // Exit after handling recovery to avoid conflicts
        }
      }

      // --- Handle Query Parameters (for showing login modal) ---
      // router.isReady ensures that router.query is populated, especially on initial client-side render.
      if (router.isReady) {
        const showLoginQueryParam = router.query.showLogin;

        if (showLoginQueryParam === "true") {
          closeAllModals(); // Good practice to close other modals
          setShowLogin(true);

          // Optional: Remove the query parameter from the URL without reloading
          const { pathname, query } = router;
          delete query.showLogin;
          router.replace({ pathname, query }, undefined, { shallow: true });
        }
      }
    };

    handleUrlParams();
  }, [router, setShowLogin, closeAllModals]); // Add router, setShowLogin, closeAllModals to dependency array

  return (
    <main>
      <Hero />
    </main>
  );
};

export default IndexPage; // Renamed to PascalCase
