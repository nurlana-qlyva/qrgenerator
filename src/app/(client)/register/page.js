"use client";

import { useState, useEffect } from "react";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import GoogleLogin from "@/components/client/pages/login/GoogleLogin";
import { signUp } from "@/api/auth/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("auth");
      if (auth) {
        router.push("/");
      }
    }
  }, [isLogin]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.surname || formData.surname.length < 2) {
      newErrors.surname = "Surname must be at least 2 characters";
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase and number";
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        firstName: formData.name,
        lastName: formData.surname,
        emailAddress: formData.email,
        password: formData.password,
      };

      const res = await signUp(data);

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

        onClose();

        if (onLoginSuccess) {
          onLoginSuccess(decoded);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl w-full mx-6 lg:mx-12 gap-12 items-center">
        {/* Sol Taraf - Açıklama */}
        <div className="flex flex-col justify-center text-left space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            <span className="text-blue-600">Create</span>,{" "}
            <span className="text-blue-500">Manage</span> and{" "}
            <span className="text-blue-700">Track</span>
          </h1>
          <p className="text-xl text-gray-600">
            All your QR Codes in one place
          </p>
          <div className="space-y-4 pt-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy Management</h3>
                <p className="text-gray-600 text-sm">
                  Create and edit your QR codes with ease
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Detailed Analytics
                </h3>
                <p className="text-gray-600 text-sm">
                  Track your QR code usage in real-time
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-600 font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Secure Platform</h3>
                <p className="text-gray-600 text-sm">
                  Your data is safe with us
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sağ Taraf - Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-10 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign Up</h2>
            <p className="text-gray-600">
              Let's get you all set up so you can access your personal account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Ad & Soyad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John"
                  className={`border rounded-lg px-4 py-2.5 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.name ? "border-red-500 bg-red-50" : "border-gray-300"
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  placeholder="Doe"
                  className={`border rounded-lg px-4 py-2.5 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.surname
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                {errors.surname && (
                  <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                    <span>⚠</span> {errors.surname}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john.doe@example.com"
                className={`border rounded-lg px-4 py-2.5 w-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.email ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.email}
                </p>
              )}
            </div>

            {/* Şifre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 8 characters"
                  className={`border rounded-lg px-4 py-2.5 w-full pr-12 text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                    errors.password
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.password}
                </p>
              )}
            </div>

            {/* Şartlar & Koşullar */}
            <div>
              <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>
                  I agree to all the{" "}
                  <a
                    href="#"
                    className="text-red-400 hover:text-red-500 font-medium"
                  >
                    Terms
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-red-400 hover:text-red-500 font-medium"
                  >
                    Privacy Policies
                  </a>
                </span>
              </label>
              {errors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <span>⚠</span> {errors.agreeToTerms}
                </p>
              )}
            </div>

            {/* Kayıt Ol Butonu */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all disabled:bg-blue-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

            {/* Giriş Yap Linki */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Login
              </a>
            </p>

            {/* Google ile Giriş */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <button
              type="button"
              className="w-full rounded-[4px] transition-all flex items-center justify-center"
            >
              <GoogleLogin setIsLogin={setIsLogin} isLogin={isLogin} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
