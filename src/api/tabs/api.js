import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function getQRCodeService(data) {
  try {
    const authData = JSON.parse(localStorage.getItem("auth") || "{}");
    const token = authData?.token;

    if (!token) {
      throw new Error("No authentication token found. Please login again.");
    }

    if (authData.expiry && Date.now() > authData.expiry) {
      throw new Error("Token expired. Please login again.");
    }

    const res = await axios.post(`${API_BASE}/QRCode/generate`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data;
  } catch (error) {
    console.error("QR Code generation error:", error);

    // API error handling
    if (error.response?.status === 401) {
      throw new Error("Authentication failed. Please login again.");
    } else if (error.response?.status === 403) {
      throw new Error("Access denied. You don't have permission.");
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message || "QR Code generation failed");
    }
  }
}
