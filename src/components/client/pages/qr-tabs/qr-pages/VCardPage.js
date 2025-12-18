"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { getVCardService } from "@/api/tabs/api";

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
        setVcardData(data);
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
URL:${vcardData.website || ""}
${vcardData.socialLinks?.map(link => `URL;TYPE=${link.platform}:${link.url}`).join("\n") || ""}
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ana Sayfaya Dön
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Kart Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Gradient */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
            <div className="absolute inset-0 bg-black/10"></div>
          </div>

          {/* Profile Section */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-16 mb-6">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {vcardData.firstName?.charAt(0)}{vcardData.lastName?.charAt(0)}
                </span>
              </div>
            </div>

            {/* Name */}
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              {vcardData.firstName} {vcardData.lastName}
            </h1>
            
            {/* Job & Company */}
            {(vcardData.yourJob || vcardData.companyName) && (
              <p className="text-lg text-gray-600 mb-6">
                {vcardData.yourJob}
                {vcardData.yourJob && vcardData.companyName && " • "}
                {vcardData.companyName}
              </p>
            )}

            {/* Contact Information Grid */}
            <div className="grid gap-3 mb-6">
              {vcardData.mobile && (
                <a 
                  href={`tel:${vcardData.mobile}`}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Mobil</p>
                    <p className="text-gray-800 font-semibold">{vcardData.mobile}</p>
                  </div>
                  <svg className="w-5 h-5 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}

              {vcardData.phone && (
                <a 
                  href={`tel:${vcardData.phone}`}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">☎️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium">Telefon</p>
                    <p className="text-gray-800 font-semibold">{vcardData.phone}</p>
                  </div>
                  <svg className="w-5 h-5 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}

              {vcardData.email && (
                <a 
                  href={`mailto:${vcardData.email}`}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium">E-posta</p>
                    <p className="text-gray-800 font-semibold truncate">{vcardData.email}</p>
                  </div>
                  <svg className="w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              )}

              {vcardData.website && (
                <a 
                  href={vcardData.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-white text-xl">🌐</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-500 font-medium">Website</p>
                    <p className="text-gray-800 font-semibold truncate">{vcardData.website}</p>
                  </div>
                  <svg className="w-5 h-5 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}

              {vcardData.address && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-medium mb-1">Adres</p>
                    <p className="text-gray-800 font-medium leading-relaxed">{vcardData.address}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Networks */}
            {vcardData.socialLinks && vcardData.socialLinks.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🔗</span>
                  Sosyal Medya
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {vcardData.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                        <Image
                          src={`/socials/${link.platform}.png`}
                          alt={link.platform}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600 capitalize">
                        {socialPlatforms[link.platform]?.name || link.platform}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <button
              onClick={downloadVCard}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3 group"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">📥</span>
              <span>Kişiyi Kaydet</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Powered by QR Technology</p>
        </div>
      </div>
    </div>
  );
}