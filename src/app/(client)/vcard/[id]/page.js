"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getVCardService } from "@/api/tabs/api";
import { Phone, Mail, MapPin } from "lucide-react";

export default function VCardPage() {
  const params = useParams();
  const router = useRouter();
  const [vcardData, setVcardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVCardData = async () => {
      try {
        const data = await getVCardService(params.id);

        // payloadJson'u parse et
        const payload = JSON.parse(data.payloadJson);

        // Veriyi düzenle
        const formattedData = {
          firstName: payload.FirstName || "",
          lastName: payload.LastName || "",
          yourJob: payload.YourJob || "",
          companyName: payload.CompanyName || "",
          mobile: payload.Mobile1 || "",
          phone: payload.Phone || "",
          fax: payload.Fax || "",
          email: payload.Email || "",
          address: payload.Address || "",
          coverPhoto: data.coverPhotoURL,
          coverColor: data.solidColor || "#E5E7EB",
          profilePhoto: data.profilePhotoURL,
          socialLinks: payload.social || [], 
        };

        setVcardData(formattedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchVCardData();
    }
  }, [params.id]);

  const downloadVCard = () => {
    if (!vcardData) return;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${vcardData.firstName} ${vcardData.lastName}
N:${vcardData.lastName};${vcardData.firstName};;;
TEL;TYPE=CELL:${vcardData.mobile || ""}
TEL;TYPE=WORK:${vcardData.phone || ""}
TEL;TYPE=FAX:${vcardData.fax || ""}
EMAIL:${vcardData.email || ""}
ORG:${vcardData.companyName || ""}
TITLE:${vcardData.yourJob || ""}
ADR;TYPE=WORK:;;${vcardData.address || ""};;;;
URL:${vcardData.social || ""}
${
  vcardData.socialLinks
    ?.map((link) => `URL;TYPE=${link.platform}:${link.url}`)
    .join("\n") || ""
}
END:VCARD`;

    const blob = new Blob([vcard], { type: "text/vcard" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${vcardData.firstName}_${vcardData.lastName}.vcf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  if (!vcardData) return null;

  const socialPlatforms = {
    linkedin: { name: "LinkedIn", color: "#0077b5" },
    tiktok: { name: "TikTok", color: "#000000" },
    facebook: { name: "Facebook", color: "#3b5998" },
    youtube: { name: "YouTube", color: "#ff0000" },
    twitter: { name: "Twitter", color: "#0ea5e9" },
    instagram: { name: "Instagram", color: "#e1306c" },
  };

  const fullName = `${vcardData.firstName} ${vcardData.lastName}`.trim();
  const activeSocialLinks =
    vcardData.socialLinks?.filter((link) => link.url) || [];

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 flex items-center justify-center">
      <div
        className="w-full max-w-sm bg-white rounded-[12px] border-[#f5f5f5] relative"
        style={{ minHeight: "720px", border: "4px solid #f5f5f5" }}
      >
        {/* Cover Image */}
        <div
          className="relative h-48"
          style={{
            backgroundColor: vcardData.coverPhoto
              ? "transparent"
              : vcardData.coverColor || "#E5E7EB",
          }}
        >
          {vcardData.coverPhoto && (
            <img
              src={vcardData.coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          )}

          {/* Profile Picture */}
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
              {vcardData.profilePhoto ? (
                <img
                  src={vcardData.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : fullName ? (
                <span className="text-white text-2xl font-bold">
                  {vcardData.firstName?.charAt(0)}
                  {vcardData.lastName?.charAt(0)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="pt-16 px-6 pb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {fullName || "Your Name"}
            </h1>
            {vcardData.yourJob && (
              <p className="text-gray-600 text-sm">{vcardData.yourJob}</p>
            )}
            {vcardData.companyName && (
              <p className="text-gray-500 text-sm">{vcardData.companyName}</p>
            )}
          </div>

          {/* Save Contact Button */}
          <button
            onClick={downloadVCard}
            disabled={!fullName}
            className="w-full bg-black text-white py-3 rounded-full font-medium mb-6 hover:bg-gray-800 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save Contact
          </button>

          {/* Contact Details */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {vcardData.mobile && (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="bg-green-500 rounded-xl p-2.5">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Mobile</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vcardData.mobile}
                  </p>
                </div>
              </div>
            )}

            {vcardData.phone && (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="bg-green-500 rounded-xl p-2.5">
                  <Phone size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vcardData.phone}
                  </p>
                </div>
              </div>
            )}

            {vcardData.email && (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="bg-blue-500 rounded-xl p-2.5">
                  <Mail size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vcardData.email}
                  </p>
                </div>
              </div>
            )}

            {vcardData.address && (
              <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer">
                <div className="bg-red-500 rounded-xl p-2.5">
                  <MapPin size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium text-gray-900">
                    {vcardData.address}
                  </p>
                </div>
              </div>
            )}

            {/* Social Networks */}
            {activeSocialLinks.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Social Networks
                </h3>
                <div className="space-y-3">
                  {activeSocialLinks.map((link) => {
                    const platform = socialPlatforms[link.platform];
                    return (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: platform?.color }}
                        >
                          <Image
                            src={`/socials/${link.platform}.png`}
                            alt={platform?.name}
                            width={44}
                            height={44}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {platform?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {link.url
                              .replace(/^https?:\/\//, "")
                              .replace(/^www\./, "")}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
