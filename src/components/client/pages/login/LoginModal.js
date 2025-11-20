"use client";

import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import { Eye, EyeOff } from "lucide-react";
import GoogleLogin from "./GoogleLogin";
import { signIn, refreshAccessToken } from "@/api/auth/api";
import jwt_decode from "jwt-decode";

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const refreshTimerRef = useRef(null);

  // --- 🧹 Clear existing timer ---
  const clearRefreshTimer = () => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
      console.log("⏹️ Token refresh timer cleared");
    }
  };

  // --- 🔄 Refresh token function ---
  const performTokenRefresh = async (refreshToken) => {
    try {
      console.log("🔄 Attempting to refresh token...");
      const newTokens = await refreshAccessToken(refreshToken);

      if (newTokens?.accessToken) {
        const expiry = Date.now() + 60 * 60 * 1000; // 1 hour from now
        const decoded = jwt_decode(newTokens.accessToken);

        const authData = {
          token: newTokens.accessToken,
          refreshToken: newTokens.refreshToken || refreshToken,
          expiry,
          user: decoded,
        };

        localStorage.setItem("auth", JSON.stringify(authData));
        console.log("✅ Token refreshed successfully!");

        // Schedule next refresh (55 minutes = 3,300,000 ms)
        scheduleTokenRefresh(authData.refreshToken);

        return true;
      } else {
        throw new Error("No access token received");
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      localStorage.removeItem("auth");

      // Optionally redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }

      return false;
    }
  };

  // --- ⏱️ Schedule token refresh (55 minutes before expiry) ---
  const scheduleTokenRefresh = (refreshToken) => {
    clearRefreshTimer();

    // Refresh 5 minutes before expiry (55 minutes after login)
    const refreshTime = 55 * 60 * 1000; // 55 minutes

    console.log(
      `⏰ Token refresh scheduled in ${refreshTime / 1000 / 60} minutes`
    );

    refreshTimerRef.current = setTimeout(() => {
      performTokenRefresh(refreshToken);
    }, refreshTime);
  };

  // --- 📝 Handle login submission ---
  const onSubmit = async (data) => {
    try {
      const res = await signIn(data);

      if (res.accessToken) {
        const expiry = Date.now() + 60 * 60 * 1000; // 1 hour
        const token = res.accessToken;
        const refreshToken = res.refreshToken;
        const decoded = jwt_decode(token);

        const authData = {
          token,
          refreshToken,
          expiry,
          user: decoded,
        };

        localStorage.setItem("auth", JSON.stringify(authData));
        console.log("✅ Login successful!");

        // Start automatic token refresh timer
        scheduleTokenRefresh(refreshToken);

        reset();
        onClose();

        if (onLoginSuccess) {
          onLoginSuccess(decoded);
        }
      }
    } catch (error) {
      console.error("❌ Login failed:", error);
    }
  };

  // --- 🚪 Handle modal close ---
  const handleModalClose = () => {
    reset();
    setShowPassword(false);
    onClose();
  };

  // --- 🎯 Initialize token refresh on mount ---
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const authString = localStorage.getItem("auth");
        if (!authString) return;

        const auth = JSON.parse(authString);
        if (!auth?.refreshToken) return;

        const now = Date.now();
        const timeUntilExpiry = auth.expiry - now;

        // If token expires in less than 5 minutes, refresh immediately
        if (timeUntilExpiry < 5 * 60 * 1000) {
          console.log("⚠️ Token expiring soon, refreshing immediately...");
          await performTokenRefresh(auth.refreshToken);
        } else {
          // Token still valid, schedule refresh
          const timeUntilRefresh = timeUntilExpiry - 5 * 60 * 1000; // 5 min before expiry
          console.log(
            `⏰ Scheduling refresh in ${timeUntilRefresh / 1000 / 60} minutes`
          );

          clearRefreshTimer();
          refreshTimerRef.current = setTimeout(() => {
            performTokenRefresh(auth.refreshToken);
          }, timeUntilRefresh);
        }
      } catch (error) {
        console.error("❌ Auth initialization failed:", error);
        localStorage.removeItem("auth");
      }
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      clearRefreshTimer();
    };
  }, []);

  // --- 👁️ Check token expiry every minute ---
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const authString = localStorage.getItem("auth");
      if (!authString) return;

      const auth = JSON.parse(authString);
      const now = Date.now();

      // If token expired, refresh immediately
      if (now >= auth.expiry) {
        console.log("⚠️ Token expired, refreshing...");
        performTokenRefresh(auth.refreshToken);
      }
    }, 60 * 1000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <Modal open={open} onCancel={handleModalClose} footer={null} title="Login">
      <div className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              placeholder="john.doe@gmail.com"
              className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                placeholder="••••••••"
                className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500" style={{ color: "#FF8682" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("remember")} />
              Remember me
            </label>
            <a
              href="#"
              className="text-red-500 hover:underline"
              style={{ color: "#FF8682" }}
            >
              Forgot Password
            </a>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            style={{ color: "#fff" }}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-sm">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-red-500 hover:underline"
              style={{ color: "#FF8682" }}
            >
              Sign up
            </a>
          </p>
        </form>

        {/* Google Login */}
        <div className="mt-6 border-t pt-6">
          <GoogleLogin onLoginSuccess={onLoginSuccess} onClose={onClose} />
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;
