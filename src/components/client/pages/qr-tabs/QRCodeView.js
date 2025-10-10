"use client";

import { getQRCodeService } from "@/api/tabs/api";
import { Image } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";

const QRCodeView = ({
  selectedFrame,
  selectedBGColor,
  selectedColor,
  selectedFrameColor,
  selectedSocialIcon,
  qrContent,
}) => {
  const [selectedFormat, setSelectedFormat] = useState("PNG");
  const [selectedSize, setSelectedSize] = useState("1000px");
  const [qrBase64, setQrBase64] = useState(null);

  // Frame'e göre QR kod pozisyonunu belirle
  const getQRPosition = () => {
    if (!selectedFrame) {
      return {
        size: 150,
        top: "10%",
        left: "2%",
        scale: 1,
      };
    }

    // Frame metadata'sından pozisyon bilgilerini al
    const framePosition = selectedFrame.qrPosition || {};

    return {
      size: framePosition.size || 120,
      top: framePosition.top || "0%",
      left: framePosition.left || "50%",
      scale: framePosition.scale || 1,
    };
  };

  const qrPosition = getQRPosition();
  const socialIconPosition = selectedFrame?.socialIconPosition;

  const handleGenerate = async () => {
    console.log(selectedFrame)
    const body = {
      type: 1,
      payload: {
        Url: qrContent,
      },
      designOptions: {
        foregroundColor: selectedColor,
        backgroundColor: selectedBGColor,
        shape: 1,
        // logoId: null,
        finderStyle: 1,
        frameForegroundColor: selectedFrameColor,
        frameStyle: 1,
      },
    };

    try {
      const res = await getQRCodeService(body);
      console.log("QR Code Response:", res);

      if (res?.qrCodeBase64) {
        setQrBase64(`data:image/png;base64,${res.qrCodeBase64}`);
        console.log("QR Code generated successfully!");
      } else {
        throw new Error("Invalid response format");
      }

      return res;
    } catch (error) {
      console.error("Generate QR Error:", error);

      if (
        error.message.includes("authentication") ||
        error.message.includes("token")
      ) {
        alert("Please login again to continue.");
      } else {
        alert(`Error: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    if (!qrContent || !selectedBGColor || !selectedColor) {
      return;
    }
    handleGenerate();
  }, [
    selectedFrame,
    selectedFrameColor,
    selectedBGColor,
    selectedColor,
    selectedSocialIcon,
    qrContent,
  ]);

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
              {/* Frame Background - En altta */}
              {selectedFrame && (
                <img
                  src={selectedFrame.frame}
                  alt={`QR Frame ${selectedFrame.id}`}
                  className="absolute inset-0 w-full h-full object-contain z-10"
                  style={{
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))",
                    top: "0%",
                    left: "-10%",
                  }}
                />
              )}

              {/* QR Code - Dinamik pozisyonlama */}
              {qrBase64 ? (
                <div
                  className="absolute z-20"
                  style={{
                    top: qrPosition.top,
                    left: qrPosition.left,
                    transform: `${qrPosition.transform} 
                             scale(${qrPosition.scale})`,
                    transformOrigin: "center",
                  }}
                >
                  <Image
                    src={qrBase64}
                    alt="Generated QR"
                    width={qrPosition.size}
                    height={qrPosition.size}
                    preview={false}
                    style={{
                      objectFit: "contain",
                    }}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div
                  className="absolute z-20"
                  style={{
                    top: qrPosition.top,
                    left: qrPosition.left,
                    transform: `${qrPosition.transform} 
                             scale(${qrPosition.scale})`,
                    transformOrigin: "center",
                  }}
                ></div>
              )}

              {/* Social Media Icon - QR kodun tam ortasında */}
              {selectedSocialIcon && (
                <div
                  className="absolute z-30 flex items-center justify-center"
                  style={{
                    top: socialIconPosition?.top,
                    left: socialIconPosition?.left,
                    translate: socialIconPosition?.transform,
                    width: "40px",
                    height: "40px",
                  }}
                >
                  <Image
                    src={selectedSocialIcon.icon}
                    alt={`${selectedSocialIcon.name} icon`}
                    width={40}
                    height={40}
                    preview={false}
                    style={{
                      objectFit: "contain",
                    }}
                  />
                </div>
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
