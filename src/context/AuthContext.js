"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const loginModalRef = useRef(null);

  // Check for existing auth on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = localStorage.getItem("auth");
        if (auth) {
          const parsedAuth = JSON.parse(auth);
          // Check if token is still valid
          if (parsedAuth.expiry && Date.now() < parsedAuth.expiry) {
            setUser(parsedAuth.user);
          } else {
            // Token expired, remove from localStorage
            localStorage.removeItem("auth");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("auth");
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const openLoginModal = () => setIsModalOpen(true);
  const closeLoginModal = () => setIsModalOpen(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("auth");

    if (loginModalRef.current) {
      loginModalRef.current.clearGoogleSession();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        // States
        user,
        isModalOpen,
        loginModalRef,

        // Actions
        openLoginModal,
        closeLoginModal,
        handleLoginSuccess,
        handleLogout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
