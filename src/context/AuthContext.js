"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const loginModalRef = useRef(null);
  const refreshTimerRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // LocalStorage helpers
  const getAuthData = useCallback(() => {
    if (typeof window === "undefined") return null;
    try {
      const authString = localStorage.getItem("auth");
      return authString ? JSON.parse(authString) : null;
    } catch (error) {
      console.error("❌ Auth data parse error:", error);
      return null;
    }
  }, []);

  const setAuthData = useCallback((data) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("auth", JSON.stringify(data));
    setUser(data.user);
    setIsAuthenticated(true);
  }, []);

  const clearAuthData = useCallback(() => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("auth");
    setUser(null);
    setIsAuthenticated(false);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  }, []);

  // Token refresh API
  const refreshAccessToken = useCallback(async (refreshToken) => {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_BASE;
      const response = await fetch(`${API_BASE}/Account/refresh-signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) throw new Error("Token refresh failed");
      return await response.json();
    } catch (error) {
      console.error("❌ Token refresh error:", error);
      throw error;
    }
  }, []);

  // Token refresh logic
  const performTokenRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return false;

    const auth = getAuthData();
    if (!auth?.refreshToken) return false;

    try {
      isRefreshingRef.current = true;
      console.log("🔄 Refreshing token...");

      const newTokens = await refreshAccessToken(auth.refreshToken);

      if (newTokens?.accessToken) {
        const decoded = jwtDecode(newTokens.accessToken);
        const expiry = Date.now() + 60 * 60 * 1000;

        setAuthData({
          token: newTokens.accessToken,
          refreshToken: newTokens.refreshToken || auth.refreshToken,
          expiry,
          user: decoded,
        });

        console.log("✅ Token refreshed successfully");
        scheduleTokenRefresh();
        return true;
      }
    } catch (error) {
      console.error("❌ Token refresh failed:", error);
      clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    } finally {
      isRefreshingRef.current = false;
    }
    return false;
  }, [getAuthData, refreshAccessToken, setAuthData, clearAuthData]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback(() => {
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const auth = getAuthData();
    if (!auth?.expiry) return;

    const timeUntilExpiry = auth.expiry - Date.now();
    const refreshTime = Math.max(0, timeUntilExpiry - 5 * 60 * 1000);

    console.log(
      `⏰ Token refresh scheduled in ${Math.round(
        refreshTime / 1000 / 60
      )} minutes`
    );

    refreshTimerRef.current = setTimeout(() => {
      performTokenRefresh();
    }, refreshTime);
  }, [getAuthData, performTokenRefresh]);

  // Login success handler
  const handleLoginSuccess = useCallback(
    (userInfo, tokens) => {
      const expiry = Date.now() + 60 * 60 * 1000;
      const authData = {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiry,
        user: userInfo,
      };

      setAuthData(authData);
      scheduleTokenRefresh();
      setIsModalOpen(false);
    },
    [setAuthData, scheduleTokenRefresh]
  );

  // Logout handler
  const handleLogout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  // Modal handlers
  const openLoginModal = useCallback(() => setIsModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsModalOpen(false), []);

  // Initialize auth on mount
  useEffect(() => {
    const auth = getAuthData();
    if (!auth?.token) return;

    try {
      const decoded = jwtDecode(auth.token);
      setUser(decoded);
      setIsAuthenticated(true);

      const timeUntilExpiry = auth.expiry - Date.now();

      if (timeUntilExpiry <= 0 || timeUntilExpiry < 5 * 60 * 1000) {
        performTokenRefresh();
      } else {
        scheduleTokenRefresh();
      }
    } catch (error) {
      console.error("❌ Token decode error:", error);
      clearAuthData();
    }

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Periodic token check
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const auth = getAuthData();
      if (!auth?.expiry) return;

      const timeUntilExpiry = auth.expiry - Date.now();
      if (timeUntilExpiry <= 60 * 1000) {
        performTokenRefresh();
      }
    }, 60 * 1000);

    return () => clearInterval(checkInterval);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isModalOpen,
        loginModalRef,
        openLoginModal,
        closeLoginModal,
        handleLoginSuccess,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
