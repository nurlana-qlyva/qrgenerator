"use client";

import { continueWithGoogle } from "@/api/auth/api";
import { useEffect, useRef } from "react";

export default function GoogleLogin({ onLoginSuccess, onClose, setIsLogin, isLogin }) {
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      // Önce auto select kapat
      window.google.accounts.id.disableAutoSelect();

      // Google init
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
            if (data.accessToken) {
              const expiry = Date.now() + 24 * 60 * 60 * 1000;
              const token = data.accessToken;
              const refreshToken = data.refreshToken;
              const decodeJWT = (token) =>
                JSON.parse(atob(token.split(".")[1]));
              const decoded = decodeJWT(token);

              localStorage.setItem(
                "auth",
                JSON.stringify({ token, refreshToken, expiry, user: decoded })
              );

              if (onClose) {
                onClose();
              }
              if (onLoginSuccess) {
                onLoginSuccess(decoded);
              }

              if (!isLogin) {
                setIsLogin(true)
              }
            }
          } catch (err) {
            console.error("Backend error:", err);
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: false,
        use_fedcm_for_prompt: false,
      });

      // Buton render
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "icon",
        size: "large",
        theme: "outline",
        shape: "rectangular",
        text: "signup",
        logo_alignment: "center",
        personalization: "none",
      });
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [onLoginSuccess, onClose]);

  return <div ref={googleButtonRef}></div>;
}
