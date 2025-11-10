import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Edit,
  Globe,
  Upload,
  ChevronDown,
} from "lucide-react";
import { useContact } from "@/context/ContactCardContext";

export default function ContactCard() {
  const { formData } = useContact();
  const [coverImage, setCoverImage] = useState(null);
  const [coverColor, setCoverColor] = useState("#E5E7EB");
  const [profileImage, setProfileImage] = useState(null);
  const [showCoverDropdown, setShowCoverDropdown] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const coverInputRef = useRef(null);
  const profileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  const solidColors = [
    "#EF4444",
    "#F59E0B",
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#14B8A6",
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCoverDropdown(false);
        setShowColorPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(reader.result);
        setShowCoverDropdown(false);
        setShowColorPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorSelect = (color) => {
    setCoverImage(null);
    setCoverColor(color);
    setShowColorPicker(false);
    setShowCoverDropdown(false);
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveContact = () => {
    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${formData.firstname} ${formData.lastname}
TITLE:${formData.job}
ORG:${formData.companyName}
TEL;TYPE=CELL:${formData.mobile}
TEL;TYPE=WORK:${formData.phone}
TEL;TYPE=FAX:${formData.fax}
EMAIL:${formData.email}
ADR:;;${formData.street};${formData.city};${formData.state};${formData.country}
URL:${formData.website}
URL:${formData.linkedin}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formData.firstname}-${formData.lastname}.vcf`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const fullName = `${formData.firstname} ${formData.lastname}`.trim();
  const fullAddress =
    `${formData.street} ${formData.city} ${formData.state} ${formData.country}`.trim();

  return (
    <div
      className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-y-scroll mb-4 scrollbar-hide"
      style={{ height: "884px" }}
    >
      {/* Cover Image */}
      <div
        className="relative h-48 stciky top-0"
        style={{ backgroundColor: coverImage ? "transparent" : coverColor }}
      >
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute top-4 right-4" ref={dropdownRef}>
          <button
            onClick={() => setShowCoverDropdown(!showCoverDropdown)}
            className="bg-white rounded-lg px-3 py-2 shadow-md flex items-center gap-2 text-sm hover:bg-gray-50 transition"
          >
            <Edit size={14} />
            <span className="text-xs">Edit cover</span>
          </button>

          {/* Dropdown Menu */}
          {showCoverDropdown && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
              {/* Upload Picture */}
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="hidden"
              />
              <button
                onClick={() => coverInputRef.current?.click()}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition"
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <Upload size={16} className="text-gray-600" />
                </div>
                <span className="text-gray-700">Upload picture</span>
              </button>

              {/* Solid Color */}
              <div
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition cursor-pointer"
              >
                <div
                  className="w-5 h-5 rounded"
                  style={{ backgroundColor: coverColor }}
                />
                <span className="text-gray-700 flex-1">Solid color</span>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${
                    showColorPicker ? "rotate-180" : ""
                  }`}
                />
              </div>

              {/* Color Picker */}
              {showColorPicker && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-500">Hex</span>
                    <input
                      type="text"
                      value={coverColor}
                      onChange={(e) => setCoverColor(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="#262A45"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {solidColors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(color)}
                        className="w-full aspect-square rounded-md hover:scale-110 transition-transform border border-gray-200"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : fullName ? (
                <span className="text-white text-2xl font-bold">
                  {formData.firstname.charAt(0)}
                  {formData.lastname.charAt(0)}
                </span>
              ) : null}
            </div>
            <input
              ref={profileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 transition"
            >
              <Edit size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Contact Info */}
      <div className="pt-16 px-6 pb-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            {fullName || "Your Name"}
          </h1>
          {formData.job && (
            <p className="text-gray-600 text-sm">{formData.job}</p>
          )}
          {formData.companyName && (
            <p className="text-gray-500 text-sm">{formData.companyName}</p>
          )}
        </div>

        {/* Save Contact Button */}
        <button
          onClick={handleSaveContact}
          disabled={!fullName}
          className="w-full bg-black text-white py-3 rounded-full font-medium mb-6 hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Save Contact
        </button>

        {/* Contact Details */}
        <div className="space-y-3">
          {formData.mobile && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-green-500 rounded-xl p-2.5">
                <Phone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Mobile</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.mobile}
                </p>
              </div>
            </div>
          )}

          {formData.phone && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-green-500 rounded-xl p-2.5">
                <Phone size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.phone}
                </p>
              </div>
            </div>
          )}

          {formData.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-blue-500 rounded-xl p-2.5">
                <Mail size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.email}
                </p>
              </div>
            </div>
          )}

          {fullAddress && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-red-500 rounded-xl p-2.5">
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">
                  {fullAddress}
                </p>
              </div>
            </div>
          )}

          {formData.website && (
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-purple-500 rounded-xl p-2.5">
                <Globe size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Website</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.website}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Social Networks */}
        {formData.linkedin && (
          <div className="mt-6">
            <p className="text-xs text-gray-500 mb-3">Social Networks</p>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
              <div className="bg-blue-600 rounded-xl p-2.5">
                <Linkedin size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">LinkedIn</p>
                <p className="text-sm font-medium text-gray-900">
                  {formData.linkedin}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
