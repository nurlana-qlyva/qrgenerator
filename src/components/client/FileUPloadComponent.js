"use client";

import React, { useState } from "react";
import { Image, Upload, message } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const { Dragger } = Upload;

const socialIcons = [
  {
    name: "Facebook",
    icon: "./socials/social_1.png",
  },
  {
    name: "X (Twitter)",
    icon: "./socials/social_2.png",
  },
  {
    name: "Instagram",
    icon: "./socials/social_3.png",
  },
  {
    name: "TikTok",
    icon: "./socials/social_4.png",
  },
  {
    name: "YouTube",
    icon: "./socials/social_5.png",
  },
  {
    name: "WhatsApp",
    icon: "./socials/social_6.png",
  },
  {
    name: "LinkedIn",
    icon: "./socials/social_7.png",
  },
  {
    name: "Behance",
    icon: "./socials/social_8.png",
  },
  {
    name: "Twitch",
    icon: "./socials/social_9.png",
  },
  {
    name: "Telegram",
    icon: "./socials/social_10.png",
  },
  {
    name: "Dribbble",
    icon: "./socials/social_11.png",
  },
  {
    name: "Threads",
    icon: "./socials/social_12.png",
  },
];

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
    <Image src={icon} alt={`${name} qr code`} preview={false} />
  </div>
);

const FileUploadComponent = ({ selectedSocialIcon, onSocialIconSelect }) => {
  const [fileList, setFileList] = useState([]);

  const uploadProps = {
    name: "file",
    multiple: true,
    accept: ".jpg,.jpeg,.png",
    fileList,
    onChange(info) {
      const { status } = info.file;
      setFileList(info.fileList);

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    beforeUpload: (file) => {
      const isValidType =
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png";
      if (!isValidType) {
        message.error("You can only upload JPG, JPEG & PNG files!");
        return false;
      }
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error("Image must smaller than 5MB!");
        return false;
      }
      return false; // Prevent automatic upload
    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const handleSocialIconClick = (social) => {
    // Aynı ikona tekrar tıklanırsa seçimi kaldır
    if (selectedSocialIcon?.name === social.name) {
      onSocialIconSelect(null);
    } else {
      onSocialIconSelect(social);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 bg-gray-50 rounded-lg">
      {/* Social Media Icons */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Choose Social Media Icon:</h4>
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {socialIcons.map((social, index) => (
            <SocialIcon
              key={index}
              icon={social.icon}
              name={social.name}
              isSelected={selectedSocialIcon?.name === social.name}
              onClick={() => handleSocialIconClick(social)}
            />
          ))}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto p-4 bg-white border-2 border-blue-400 rounded-lg">
        {/* File Upload Area */}
        <Dragger
          {...uploadProps}
          className="bg-gray-50 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors"
          style={{
            background: "#f8f9fa",
            border: "2px dashed #cbd5e1",
          }}
        >
          <div className="flex flex-col items-center justify-center py-12">
            <DownloadOutlined className="text-4xl text-blue mb-4" />
            <p className="text-lg text-gray-700 mb-2 font-medium">
              Drag your file(s) to start uploading
            </p>
          </div>
        </Dragger>

        {/* File Type Info */}
        <p className="text-sm text-gray-500 mt-3 ml-1">
          Only support .jpg, .jpeg and .png files
        </p>
      </div>
    </div>
  );
};

export default FileUploadComponent;