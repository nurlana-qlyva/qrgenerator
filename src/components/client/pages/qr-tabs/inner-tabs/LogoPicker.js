"use client";

import React, { useEffect } from "react";
import { Image, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useQRDesign } from "@/context/QRDesignContext";
import { getLogoListService } from "@/api/tabs/api";

const { Dragger } = Upload;

const SocialIcon = ({ icon, name, isSelected, onClick }) => (
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-200 ${
      isSelected
        ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg"
        : "hover:shadow-md"
    }`}
    title={name}
    onClick={onClick}
  >
    <Image src={icon} alt={`${name} logo`} preview={false} />
  </div>
);

const LogoPicker = () => {
  const {
    selectedSocialIcon,
    setSelectedSocialIcon,
    socialIcons,
    setSocialIcons,
  } = useQRDesign();

  const fetchLogos = async () => {
    try {
      const res = await getLogoListService();
      setSocialIcons(res.items || []);
    } catch (err) {
      console.error("Failed to fetch logos:", err);
    }
  };

  useEffect(() => {
    fetchLogos();
  }, []);

  const authData = JSON.parse(localStorage.getItem("auth") || "{}");
  const token = authData?.token;

  const uploadProps = {
    name: "file",
    multiple: false,
    accept: ".jpg,.jpeg,.png",

    async beforeUpload(file) {
      const isValidType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isValidType) {
        message.error("Only JPG, JPEG & PNG files are allowed!");
        return false;
      }

      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must be smaller than 5MB!");
        return false;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(
          "https://qrgenerates.com/api/QRCodeLogo/upload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (!res.ok) {
          const text = await res.text();
          console.error("Upload failed response:", text);
          throw new Error("Failed to upload image to server");
        }

        let data = null;
        try {
          const text = await res.text();
          data = text ? JSON.parse(text) : {};
        } catch (parseError) {
          console.warn("⚠️ Response is not valid JSON or empty.");
        }

        message.success("Image uploaded successfully!");
        console.log("✅ Server response:", data);

        fetchLogos();
      } catch (error) {
        console.error("❌ Upload error:", error);
        message.error("Failed to upload image.");
      }

      return false;
    },
  };

  const handleSocialIconClick = (social) => {
    if (selectedSocialIcon?.name === social.name) {
      setSelectedSocialIcon(social.id);
    } 
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg">
      {/* Mevcut Sosyal Medya Logoları */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">
          Choose Social Media Icon:
        </h4>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {(socialIcons || []).map((social) => (
            <SocialIcon
              key={social.id}
              icon={social.fileURL}
              name={social.id}
              isSelected={selectedSocialIcon?.name === social.id}
              onClick={() => handleSocialIconClick(social)}
            />
          ))}
        </div>
      </div>

      {/* Upload Alanı */}
      <div className="w-full mx-auto p-4 bg-white border-2 border-blue-400 rounded-lg">
        <Dragger {...uploadProps}>
          <div className="flex flex-col items-center justify-center py-12">
            <UploadOutlined className="text-4xl text-blue-500 mb-4" />
            <p className="text-lg text-gray-700 mb-2 font-medium">
              Drag or click to upload your icon
            </p>
          </div>
        </Dragger>
        <p className="text-sm text-gray-500 mt-3 ml-1">
          Only .jpg, .jpeg, and .png files (max 5MB)
        </p>
      </div>
    </div>
  );
};

export default LogoPicker;
