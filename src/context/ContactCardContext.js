"use client";

import React, { createContext, useContext, useState } from "react";

// Create Context
const ContactContext = createContext();

// Context Provider Component
export function ContactProvider({ children }) {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    mobile: "",
    phone: "",
    fax: "",
    email: "",
    companyName: "",
    job: "",
    address: "",
    website: "",
    linkedin: "",
    socialLinks: [{ id: Date.now(), platform: "linkedin", url: "" }],
  });

  const updateFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addSocialLink = () => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: Date.now(), platform: "linkedin", url: "" },
      ],
    }));
  };

  const removeSocialLink = (id) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((link) => link.id !== id),
    }));
  };

  const updateSocialLink = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((link) =>
        link.id === id ? { ...link, [field]: value } : link
      ),
    }));
  };

  return (
    <ContactContext.Provider
      value={{
        formData,
        updateFormData,
        addSocialLink,
        removeSocialLink,
        updateSocialLink,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
}

// Custom Hook to use Contact Context
export function useContact() {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error("useContact must be used within ContactProvider");
  }
  return context;
}
