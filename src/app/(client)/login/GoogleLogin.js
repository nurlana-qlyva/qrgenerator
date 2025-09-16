"use client";

import { continueWithGoogle } from "@/auth/api.js";
import { useEffect, useRef } from "react";
import jwt_decode from "jwt-decode";

export default function GoogleLogin() {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
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
            if (data.accessToken) {
              const expiry = Date.now() + 24 * 60 * 60 * 1000;
              const token = data.accessToken;
              const decoded = jwt_decode(token);

              localStorage.setItem(
                "auth",
                JSON.stringify({ token, expiry, user: decoded })
              );
            }
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
        logo_alignment: "center",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div ref={googleButtonRef}></div>
    </>
  );
}
