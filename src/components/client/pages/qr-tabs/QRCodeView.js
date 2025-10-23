"use client";

import { useQRDesign } from "@/context/QRDesignContext";
import { Image } from "antd";
import axios from "axios";
import { useState } from "react";

const QRCodeView = ({ qrBase64 }) => {
  const [selectedFormat, setSelectedFormat] = useState("PNG");
  const [selectedSize, setSelectedSize] = useState("1000px");

  const { selectedBGColor, selectedColor, qrContent } = useQRDesign();

  const handleDownload = async () => {
    const API_BASE = "https://qrgenerates.com";
    const body = {
      type: 1,
      payload: {
        Url: qrContent,
      },
      designOptions: {
        foregroundColor: selectedColor,
        backgroundColor: selectedBGColor,
        shape: 1,
        logoId: null,
      },
    };

    try {
      const authData = JSON.parse(localStorage.getItem("auth"));
      const token = authData?.token;

      if (!token) {
        console.error("No token found in localStorage");
        return;
      }

      const res = await axios.post(`${API_BASE}/api/QRCode/save`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      setQrBase64(`data:image/png;base64,${res.data.qrCodeBase64}`);
      return res.data;
    } catch (error) {
      console.error(error);
    }

    console.log("yes");
  };

  return (
    <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-blue-200">
      {/* Header area */}
      <div className="bg-gray-50 px-8 py-12">
        {/* QR Code Container */}
        <div className="relative">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
              {/* QR Code - Dinamik pozisyonlama */}
              {qrBase64 ? (
                <div>
                  <Image
                    src={qrBase64}
                    alt="Generated QR"
                    preview={false}
                    style={{
                      objectFit: "contain",
                    }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="px-6 py-6 space-y-4">
        {/* Format Selection */}
        <div className="flex gap-3">
          {["PNG", "SVG"].map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedFormat === format
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Size Selection */}
        <div className="flex gap-2">
          {["200px", "1000px", "2000px"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                selectedSize === size
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <button
          // onClick={handleDownload}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Create QR
        </button>
      </div>
    </div>
  );
};

export default QRCodeView;
