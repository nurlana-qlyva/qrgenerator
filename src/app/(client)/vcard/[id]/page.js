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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Hata</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Kart Container */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
          {/* Header Gradient */}
          <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          </div>

          {/* Profile Section */}
          <div className="px-6 sm:px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-20 mb-6">
              <div className="w-36 h-36 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 rounded-full border-4 border-white shadow-2xl flex items-center justify-center mx-auto transform hover:scale-105 transition-transform">
                <span className="text-5xl font-bold text-white">
                  {vcardData.firstName?.charAt(0)}
                  {vcardData.lastName?.charAt(0)}
                </span>
              </div>
            </div>

            {/* Name */}
            <div className="text-center mb-2">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {vcardData.firstName} {vcardData.lastName}
              </h1>

              {/* Job & Company */}
              {(vcardData.yourJob || vcardData.companyName) && (
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  {vcardData.yourJob && (
                    <span className="text-lg font-medium">
                      {vcardData.yourJob}
                    </span>
                  )}
                  {vcardData.yourJob && vcardData.companyName && (
                    <span className="text-gray-400">•</span>
                  )}
                  {vcardData.companyName && (
                    <span className="text-lg">{vcardData.companyName}</span>
                  )}
                </div>
              )}
            </div>

            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-8 rounded-full"></div>

            {/* Contact Information Grid */}
            <div className="grid gap-3 mb-8">
              {vcardData.mobile && (
                <a
                  href={`tel:${vcardData.mobile}`}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all group border border-blue-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-2xl">📱</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-blue-600 font-semibold uppercase tracking-wide">
                      Mobil
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {vcardData.mobile}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}

              {vcardData.phone && (
                <a
                  href={`tel:${vcardData.phone}`}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all group border border-green-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-2xl">☎️</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-green-600 font-semibold uppercase tracking-wide">
                      Telefon
                    </p>
                    <p className="text-gray-900 font-semibold text-lg">
                      {vcardData.phone}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}

              {vcardData.email && (
                <a
                  href={`mailto:${vcardData.email}`}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all group border border-purple-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-2xl">✉️</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-purple-600 font-semibold uppercase tracking-wide">
                      E-posta
                    </p>
                    <p className="text-gray-900 font-semibold text-lg truncate">
                      {vcardData.email}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              )}

              {vcardData.website && (
                <a
                  href={vcardData.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl hover:from-orange-100 hover:to-orange-200 transition-all group border border-orange-200/50"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-white text-2xl">🌐</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-orange-600 font-semibold uppercase tracking-wide">
                      Website
                    </p>
                    <p className="text-gray-900 font-semibold text-lg truncate">
                      {vcardData.website}
                    </p>
                  </div>
                  <svg
                    className="w-6 h-6 text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              )}

              {vcardData.address && (
                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200/50">
                  <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <span className="text-white text-2xl">📍</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-red-600 font-semibold uppercase tracking-wide mb-1">
                      Adres
                    </p>
                    <p className="text-gray-900 font-medium leading-relaxed">
                      {vcardData.address}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Social Networks */}
            {vcardData.socialLinks && vcardData.socialLinks.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-2xl">🔗</span>
                  Sosyal Medya
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {vcardData.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-white hover:shadow-lg transition-all group border border-gray-200"
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shadow-md group-hover:scale-110 transition-transform">
                        <Image
                          src={`/socials/${link.platform}.png`}
                          alt={link.platform}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 capitalize">
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
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-5 rounded-xl font-bold text-lg hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-3 group"
            >
              <span className="text-3xl group-hover:scale-110 transition-transform">
                📥
              </span>
              <span>Kişiyi Rehbere Kaydet</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">Powered by QR Technology ⚡</p>
        </div>
      </div>
    </div>
  );
}
