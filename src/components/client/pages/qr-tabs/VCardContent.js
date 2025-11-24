"use client";

import { Form, Input, Row, Col, Image, Tabs } from "antd";
import styles from "../../../../styles/HomePage.module.css";
import ColorPicker from "./inner-tabs/ColorPicker";
import FramePicker from "./inner-tabs/FramePicker";
import QRCodeView from "./QRCodeView";
import LogoPicker from "./inner-tabs/LogoPicker";
import { useState, useRef, useEffect } from "react";
import ContactCard from "./inner-tabs/ContactCard";
import { useContact } from "@/context/ContactCardContext";
import { useQRDesign } from "@/context/QRDesignContext";
import ShapePicker from "./inner-tabs/ShapePicker";
import { getQRCodeService } from "@/api/tabs/api";

export default function VCardContent() {
  const [qrBase64, setQrBase64] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const {
    // State values
    showLoginAlert,
    selectedColor,
    setSelectedColor,
    selectedFrameColor,
    setSelectedFrameColor,
    selectedBGColor,
    setSelectedBGColor,
    qrContent,
    selectedFrame,
    selectedSocialIcon,
    selectedShape,
    selectedFinder,

    // State setters
    setShowLoginAlert,
  } = useQRDesign();

  const {
    formData,
    updateFormData,
    addSocialLink,
    removeSocialLink,
    updateSocialLink,
  } = useContact();

  const handleChange = (e) => {
    updateFormData(e.target.name, e.target.value);
  };

  const handleGenerate = async () => {
    const body = {
      type: 4,
      payload: {
        firstName: formData.firstname,
        lastName: formData.lastname,
        mobile1: formData.mobile,
        // Mobile2: formData.firstname,
        phone: formData.phone,
        fax: formData.fax,
        email: formData.email,
        companyName: formData.companyName,
        yourJob: formData.job,
        address: formData.address,
        website: formData.website,
      },
      designOptions: {
        foregroundColor: selectedColor,
        backgroundColor: selectedBGColor,
        shape: selectedShape,
        logoId: selectedSocialIcon,
        finderStyle: selectedFinder,
        frameForegroundColor: selectedFrameColor,
        frameStyle: selectedFrame?.id || 0,
      },
    };

    try {
      const res = await getQRCodeService(body);

      if (res?.qrCodeBase64) {
        setQrBase64(`data:image/png;base64,${res.qrCodeBase64}`);
      } else {
        throw new Error("Invalid response format");
      }

      return res;
    } catch (error) {
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

  }, [
    selectedFrame,
    selectedFrameColor,
    selectedBGColor,
    selectedColor,
    selectedSocialIcon,
    qrContent,
    selectedShape,
    selectedFinder,
    formData
  ]);

  const [form] = Form.useForm();

  const socialPlatforms = [
    { id: "linkedin", name: "LinkedIn", color: "#0077b5" },
    { id: "tiktok", name: "TikTok", color: "#000000" },
    { id: "facebook", name: "Facebook", color: "#3b5998" },
    { id: "youtube", name: "YouTube", color: "#ff0000" },
    { id: "twitter", name: "Twitter", color: "#0ea5e9" },
    { id: "instagram", name: "Instagram", color: "#e1306c" },
  ];

  const getPlatformColor = (platform) => {
    const found = socialPlatforms.find((p) => p.id === platform);
    return found ? found.color : "#0077b5";
  };

  const title = (
    <div
      className="flex items-center gap-3"
      style={{ flex: 1, textAlign: "center" }}
    >
      <Image src="./icons/design.svg" alt="qr code content" width={30} />
      <h3 style={{ margin: "0" }}>Design your Qr</h3>
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Color",
      children: (
        <div className="flex flex-col gap-10">
          <h4 className="bg-white text-xl p-3 rounded-xl">Color</h4>
          <ColorPicker color={selectedColor} setColor={setSelectedColor} />
          <h4 className="bg-white text-xl p-3 rounded-xl">Background</h4>
          <ColorPicker color={selectedBGColor} setColor={setSelectedBGColor} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Frame",
      children: (
        <div className="flex flex-col gap-10">
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame List</h4>
          <FramePicker />
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame Color</h4>
          <ColorPicker
            color={selectedFrameColor}
            setColor={setSelectedFrameColor}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Shape",
      children: <ShapePicker />,
    },
    {
      key: "4",
      label: "Logo",
      children: <LogoPicker />,
    },
  ];

  return (
    <div style={{ background: "#fff" }}>
      <Row>
        <Col span="16">
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              background: "#F5F5F5",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Image src="./icons/content.svg" alt="qr code content" width={20} />
            <h2>Enter your content</h2>
          </div>
          <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your name
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstname"
                  placeholder="Firstname"
                  value={formData.firstname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="lastname"
                  placeholder="Lastname"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Contact */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="Mobile"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="grid grid-cols-2 gap-4 mb-3">
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="fax"
                  placeholder="Fax"
                  value={formData.fax}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <input
                type="email"
                name="email"
                placeholder="youremail@mail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Company */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="companyName"
                  placeholder="Company name"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="text"
                  name="job"
                  placeholder="Your job"
                  value={formData.job}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Social Networks */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Social Networks
              </label>
              <div className="space-y-3">
                {formData.socialLinks?.map((link) => {
                  const isOpen = openDropdownId === link.id;

                  return (
                    <div key={link.id} className="flex items-center gap-2">
                      {/* Drag Handle */}
                      <button className="text-gray-400 hover:text-gray-600 cursor-move p-1">
                        <span className="text-xl">⋮⋮</span>
                      </button>

                      {/* Custom Platform Selector */}
                      <div className="relative">
                        <button
                          onClick={() =>
                            setOpenDropdownId(isOpen ? null : link.id)
                          }
                          className="flex items-center justify-center rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          style={{
                            backgroundColor: getPlatformColor(link.platform),
                          }}
                        >
                          <Image
                            src={`/socials/${link.platform}.png`}
                            alt={link.platform}
                            width={48}
                            height={48}
                            preview={false}
                          />
                        </button>

                        {/* Dropdown Arrow */}
                        <div className="absolute -right-1 -top-1 pointer-events-none text-white text-xs bg-gray-800 rounded-full w-4 h-4 flex items-center justify-center">
                          ▼
                        </div>

                        {/* Custom Dropdown Menu */}
                        {isOpen && (
                          <>
                            {/* Backdrop */}
                            <div
                              className="fixed inset-0 z-10"
                              onClick={() => setOpenDropdownId(null)}
                            />

                            {/* Dropdown */}
                            <div className="absolute top-full mt-2 left-0 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden min-w-[100px]">
                              {socialPlatforms.map((platform) => (
                                <button
                                  key={platform.id}
                                  onClick={() => {
                                    updateSocialLink(
                                      link.id,
                                      "platform",
                                      platform.id
                                    );
                                    setOpenDropdownId(null);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors ${
                                    link.platform === platform.id
                                      ? "bg-blue-50"
                                      : ""
                                  }`}
                                >
                                  <div
                                    className="flex items-center justify-center rounded-lg"
                                    style={{ backgroundColor: platform.color }}
                                  >
                                    <Image
                                      src={`/socials/${platform.id}.png`}
                                      alt={platform.name}
                                      width={48}
                                      height={48}
                                      preview={false}
                                    />
                                  </div>
                                  <span className="font-medium text-gray-700">
                                    {platform.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* URL Input */}
                      <input
                        type="url"
                        placeholder="Enter your URL"
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(link.id, "url", e.target.value)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => removeSocialLink(link.id)}
                        className="text-blue-500 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Add More Button */}
              <button
                onClick={addSocialLink}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                <span className="text-xl">+</span>
                Add more
              </button>
            </div>
          </div>
          <div>
            <Tabs
              className={styles.designTabs}
              tabBarExtraContent={{
                left: title,
              }}
              items={items}
            />
          </div>
        </Col>
        <Col span={8} style={{ padding: "10px" }}>
          <ContactCard handleGenerate={handleGenerate} />
          <QRCodeView qrBase64={qrBase64} />
        </Col>
      </Row>
    </div>
  );
}
