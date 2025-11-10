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
    street: "",
    city: "",
    state: "",
    country: "",
    website: "",
    linkedin: "",
  });

  const updateFormData = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <ContactContext.Provider value={{ formData, updateFormData }}>
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
