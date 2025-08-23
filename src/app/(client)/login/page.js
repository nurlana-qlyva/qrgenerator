"use client";

import { useEffect, useRef } from "react";
import { continueWithGoogle } from "../api/auth/api"; // kendi API çağrın

export default function GoogleLogin() {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // SSR hatası önle

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (!process.env.NEXT_PUBLIC_CLIENTID) {
        console.error("Google Client ID is missing. Check your env vars!");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_CLIENTID,
        callback: async (response) => {
          if (!response.credential) {
            console.error("No credential received");
            return;
          }

          try {
            const data = await continueWithGoogle({
              idToken: response.credential,
            });
            console.log("Backend response:", data);
          } catch (err) {
            console.error("Backend error:", err);
          }
        },
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        size: "large",
        theme: "outline",
        shape: "rectangular",
        text: "continue_with",
        logo_alignment: "left",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div ref={googleButtonRef}></div>;
}
