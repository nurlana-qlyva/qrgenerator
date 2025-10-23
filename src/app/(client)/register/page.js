"use client";

import { useState } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import GoogleLogin from "@/components/client/pages/login/GoogleLogin";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth(); // or setUser / setAuthUser depending on your context

  // ✅ Handle Google login success
  const onLoginSuccess = async (googleUser) => {
    try {
      console.log("Google login successful:", googleUser);

      // If your backend issues a token after Google OAuth:
      // const response = await fetch("/api/auth/google", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ token: googleUser.credential }),
      // });
      // const data = await response.json();

      // Update global auth context
      login(googleUser);

      // Redirect or show success message
      console.log("User logged in successfully with Google!");
    } catch (err) {
      console.error("Google login failed:", err);
    }
  };

  // ✅ Handle Google popup close
  const onClose = () => {
    console.log("Google login popup closed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full px-6 md:px-12 gap-10">
        {/* Left text */}
        <div className="flex flex-col justify-center text-left">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-snug">
            <span className="text-blue-600 font-bold">Create</span>,{" "}
            <span className="text-blue-500 font-bold">Manage</span> and{" "}
            <span className="text-blue-700 font-bold">Track</span> all your QR
            Codes in one place
          </h1>
        </div>

        {/* Right form */}
        <div className="border rounded-2xl shadow-md p-8 bg-white">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Sign up</h2>
          <p className="text-gray-500 text-sm mb-6">
            Let’s get you all set up so you can access your personal account.
          </p>

          <form className="space-y-4">
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
              <input
                type="text"
                placeholder="Surname"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
            </div>{" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {" "}
              <input
                type="email"
                placeholder="Email"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
              <input
                type="text"
                placeholder="Phone Number"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
            </div>{" "}
            <div className="relative">
              {" "}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {" "}
                {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}{" "}
              </span>{" "}
            </div>{" "}
            <div className="relative">
              {" "}
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border border-gray-300 rounded-lg px-4 py-2 w-full"
              />{" "}
              <span
                className="absolute right-3 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {" "}
                {showConfirmPassword ? (
                  <EyeInvisibleOutlined />
                ) : (
                  <EyeOutlined />
                )}{" "}
              </span>{" "}
            </div>{" "}
            <label className="flex items-center text-sm text-gray-600">
              {" "}
              <input type="checkbox" className="mr-2" />I agree to all the{" "}
              <a href="#" className="text-blue-600 underline ml-1">
                {" "}
                Terms and Privacy Policies{" "}
              </a>{" "}
            </label>{" "}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all"
            >
              {" "}
              Create account{" "}
            </button>{" "}
            <p className="text-center text-sm text-gray-600">
              {" "}
              Already have an account?{" "}
              <a href="#" className="text-blue-600 font-medium">
                {" "}
                Login{" "}
              </a>{" "}
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <GoogleLogin onLoginSuccess={onLoginSuccess} onClose={onClose} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
