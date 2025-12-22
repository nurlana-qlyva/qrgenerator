"use client";

import { continueWithGoogle } from "@/api/auth/api";
import { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

export default function GoogleLogin({
  onLoginSuccess,
  onClose,
  setIsLogin,
  isLogin,
}) {
  const googleButtonRef = useRef(null);
  const isInitialized = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Prevent double initialization
    if (isInitialized.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      try {
        if (!window.google) {
          console.error("Google SDK not loaded");
          return;
        }

        // Disable auto select
        window.google.accounts.id.disableAutoSelect();

        // Initialize Google Sign-In
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_CLIENTID,
          callback: async (response) => {
            if (!response.credential) {
              console.error("❌ No credential received");
              setIsLoading(false);
              return;
            }

            try {
              setIsLoading(true);
              console.log("🔄 Authenticating with Google...");

              const data = await continueWithGoogle({
                idToken: response.credential,
              });

              if (data.accessToken) {
                const decoded = jwtDecode(data.accessToken);

                console.log("✅ Google authentication successful");

                // Use AuthContext's handleLoginSuccess instead of direct localStorage
                if (onLoginSuccess) {
                  onLoginSuccess(decoded, {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                  });
                }

                // Close modal
                if (onClose) {
                  onClose();
                }

                // Legacy support for setIsLogin
                if (setIsLogin && !isLogin) {
                  setIsLogin(true);
                }
              }
            } catch (err) {
              console.error("❌ Google authentication failed:", err);
              // You can add error toast notification here
            } finally {
              setIsLoading(false);
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: false,
          use_fedcm_for_prompt: false,
        });

        // Render the button
        if (googleButtonRef.current) {
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "continue_with",
            width: googleButtonRef.current.offsetWidth || 300,
            type: "standard",
            shape: "rectangular",
            logo_alignment: "left",
          });
        }

        isInitialized.current = true;
        console.log("✅ Google Sign-In initialized");
      } catch (error) {
        console.error("❌ Google SDK initialization error:", error);
      }
    };

    script.onerror = () => {
      console.error("❌ Failed to load Google Sign-In script");
    };

    document.body.appendChild(script);

    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      isInitialized.current = false;
    };
  }, []); // Empty dependency array - only run once

  const handleGoogleClick = () => {
    if (isLoading) return; // Prevent multiple clicks

    if (window.google?.accounts?.id) {
      setIsLoading(true);
      window.google.accounts.id.prompt((notification) => {
        // If user closes the popup without selecting account
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setIsLoading(false);
        }
      });
    } else {
      console.error("Google SDK not loaded");
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm font-medium text-gray-700">
              Signing in with Google...
            </p>
          </div>
        </div>
      )}

      {/* Google button will be rendered here */}
      {/* <div
        ref={googleButtonRef}
        className={`w-full flex justify-center ${
          isLoading ? "opacity-50 pointer-events-none" : ""
        }`}
      /> */}

      {/* Fallback button */}
      <button
        type="button"
        disabled={isLoading}
        className="w-full py-3 rounded-lg flex items-center justify-center gap-3 border hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleGoogleClick}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
            <span className="font-medium text-gray-600">Signing in...</span>
          </>
        ) : (
          <>
            <img src="/icons/google.svg" alt="Google" className="w-6 h-6" />
            <span className="font-medium text-gray-700">
              Continue with Google
            </span>
          </>
        )}
      </button>
    </div>
  );
}
