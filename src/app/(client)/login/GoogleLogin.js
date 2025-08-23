"use client";

import { useEffect, useRef } from "react";
import { continueWithGoogle } from "../api/auth/api"; // API çağrınız için

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
        client_id: "5176453376-nvg3krlv442mpvco4fhs6angchv0g9nk.apps.googleusercontent.com", // Google Console'dan aldığınız Client ID
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

  return (
    <>
      <div ref={googleButtonRef}></div>
    </>
  );
}
