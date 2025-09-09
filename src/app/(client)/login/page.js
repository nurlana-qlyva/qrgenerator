"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import GoogleLogin from "./GoogleLogin";
import { signIn } from "@/auth/api";
import { Image } from "antd";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    const res = await signIn(data);
    console.log(res);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="grid w-full max-w-5xl grid-cols-1 md:grid-cols-2 gap-8">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-bold">
            <span className="text-blue-600">Create</span>,
            <span className="text-blue-600">Manage</span> and
            <span className="text-blue-600">Track</span> all your QR Codes in
            one place
          </h1>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8">
          <h2 className="mb-6 text-2xl font-bold">Login</h2>
          <p
            className="mb-4 text-sm text-gray-600"
            style={{ marginBottom: "50px" }}
          >
            Login to access your qrcodegenerator account
          </p>

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
                <p
                  className="text-sm text-red-500"
                  style={{ color: "#FF8682" }}
                >
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
                href="#"
                className="text-red-500 hover:underline"
                style={{ color: "#FF8682" }}
              >
                Sign up
              </a>
            </p>
          </form>

          {/* Social Login */}
          <div className="mt-6 border-t pt-6">
            <GoogleLogin />
          </div>
        </div>
      </div>
    </div>
  );
}
