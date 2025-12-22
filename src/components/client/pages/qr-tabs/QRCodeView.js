"use client";

import { useQRDesign } from "@/context/QRDesignContext";
import { Image } from "antd";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const QRCodeView = ({ qrBase64, isLoading }) => {
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
    <div className="max-w-sm mx-auto bg-[#F5F5F5] rounded-[11px] overflow-hidden p-[34px]">
      {/* Header area */}
      {/* QR Code Container */}
      <div className="relative">
        <div className="bg-white">
          <div className="w-48 h-48 mx-auto relative flex items-center justify-center">
            {isLoading ? (
              // ✅ Loading State
              <div className="flex flex-col items-center justify-center gap-3">
                <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
                <p className="text-sm font-medium text-gray-600">
                  Generating QR Code...
                </p>
              </div>
            ) : qrBase64 ? (
              // ✅ QR Code Display
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

      {/* Controls */}
      <div className="mt-[30px]">
        {/* Format Selection */}
        <div className="flex mb-[18px]">
          {["PNG", "SVG"].map((format) => (
            <button
              key={format}
              onClick={() => setSelectedFormat(format)}
              className={`flex-1 py-3 px-4 rounded-[6px] text-sm font-medium transition-all duration-200 ${
                selectedFormat === format ? "bg-white" : "bg-none"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {/* Size Selection */}
        <div className="flex mb-[18px]">
          {["200px", "1000px", "2000px"].map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`flex-1 py-3 px-3 rounded-xl text-xs font-medium transition-all duration-200 ${
                selectedSize === size ? "bg-white" : "bg-none"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <button
          // onClick={handleDownload}
          className="w-full bg-[#1D59F9] text-white py-[16px] px-[28px] rounded-[11px] font-semibold text-base transition-colors duration-200"
        >
          Download QR
        </button>
      </div>
    </div>
  );
};

export default QRCodeView;
