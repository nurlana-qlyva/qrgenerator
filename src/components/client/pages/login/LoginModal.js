"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "antd";
import { Eye, EyeOff } from "lucide-react";
import GoogleLogin from "./GoogleLogin";
import { signIn } from "@/api/auth/api";

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const res = await signIn(data);
    if (res.accessToken) {
      const expiry = Date.now() + 60 * 60 * 1000;
      const token = res.accessToken;
      const refreshToken = res.refreshToken;
      const decoded = jwt_decode(token);
      localStorage.setItem(
        "auth",
        JSON.stringify({ token, refreshToken, expiry, user: decoded })
      );

      reset();
      onClose();

      if (onLoginSuccess) {
        onLoginSuccess(decoded);
      }
    }
  };

  const handleModalClose = () => {
    reset();
    setShowPassword(false);
    onClose();
  };

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
                {...register("password", {
                  required: "Password is required",
                })}
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
            Don’t have an account?{" "}
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
