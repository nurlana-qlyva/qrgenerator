"use client";

import { Image } from "antd";
import { useState } from "react";

const QRCodeView = ({
  selectedFrame,
  selectedColors = { primary: "#000000", background: "#ffffff" },
}) => {
  const [selectedFormat, setSelectedFormat] = useState("PNG");
  const [selectedSize, setSelectedSize] = useState("1000px");

  // QR kod SVG'si (dinamik renkler için)
  const generateQRCodeSvg = (primaryColor, backgroundColor) => `
    <svg width="200" height="200" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="29" height="29" fill="${backgroundColor}"/>
      <!-- QR kod pattern -->
    </svg>
  `;

  // Frame'e göre QR kod pozisyonunu belirle
  const getQRPosition = () => {
    if (!selectedFrame) {
      return {
        size: 160,
        top: "10%",
        left: "50%",
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

  const handleDownload = () => {
    const qrCodeSvg = generateQRCodeSvg(
      selectedColors.primary,
      selectedColors.background
    );

    console.log(
      `QR kod indirildi - Format: ${selectedFormat}, Boyut: ${selectedSize}, Frame: ${
        selectedFrame?.id || "None"
      }`
    );

    // Gerçek uygulamada burada QR kod generate edilip indirilir
    const element = document.createElement("a");
    const file = new Blob([qrCodeSvg], { type: "image/svg+xml" });
    element.href = URL.createObjectURL(file);
    element.download = `qr-code-${selectedSize}.${selectedFormat.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
                  }}
                />
              )}

              {/* QR Code - Dinamik pozisyonlama */}
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
                  src="/images/qrcode.png"
                  alt="QR Code"
                  width={qrPosition.size}
                  height={qrPosition.size}
                  preview={false}
                  style={{
                    objectFit: "contain",
                  }}
                  className="rounded-lg"
                />
              </div>
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

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Download QR
        </button>
      </div>
    </div>
  );
};

export default QRCodeView;
