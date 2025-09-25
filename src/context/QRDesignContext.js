"use client"
import { createContext, useContext, useCallback, useRef, useState, useEffect } from 'react';
import { useAuth } from "@/context/AuthCOntext";

const QRDesignContext = createContext();

export const QRDesignProvider = ({ children }) => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedBGColor, setSelectedBGColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedFrameColor, setSelectedFrameColor] = useState("#989898");
  const [selectedSocialIcon, setSelectedSocialIcon] = useState(null);
  const [qrContent, setQrContent] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const { user, openLoginModal } = useAuth();
  const debounceTimer = useRef(null);

  // URL validation
  const isValidURLRegex = (string) => {
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlPattern.test(string);
  };

  // Debounced QR content update
  const debouncedUpdateQRContent = useCallback(
    (value) => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (!isValidURLRegex(value.trim())) {
        setQrContent("");
        setShowLoginAlert(false);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        if (user) {
          const normalizedURL = value.startsWith("http")
            ? value
            : `https://${value}`;
          setQrContent(normalizedURL);
          setShowLoginAlert(false);
        } else {
          setShowLoginAlert(true);
        }
      }, 1000);
    },
    [user]
  );

  // Input change handler
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    if (showLoginAlert) {
      setShowLoginAlert(false);
    }

    debouncedUpdateQRContent(value);
  };

  // Login handler
  const handleLoginClick = () => {
    openLoginModal();
    setShowLoginAlert(false);
  };

  // Input validation status
  const getInputStatus = () => {
    if (!inputValue) return {};

    const isValid = isValidURLRegex(inputValue.trim());
    return {
      validateStatus: isValid ? "success" : "error",
      help: !isValid
        ? "Please enter a valid URL (e.g., example.com or https://example.com)"
        : "",
    };
  };

  // Reset all design settings
  const resetDesign = () => {
    setSelectedFrame(null);
    setSelectedBGColor("#ffffff");
    setSelectedColor("#000000");
    setSelectedFrameColor("#989898");
    setSelectedSocialIcon(null);
  };

  // Reset all states
  const resetAll = () => {
    resetDesign();
    setQrContent("");
    setInputValue("");
    setShowLoginAlert(false);
  };

  // Effect for user login state change
  useEffect(() => {
    if (user && inputValue && isValidURLRegex(inputValue.trim())) {
      const normalizedURL = inputValue.startsWith("http")
        ? inputValue
        : `https://${inputValue}`;
      setQrContent(normalizedURL);
      setShowLoginAlert(false);
    }
  }, [user, inputValue]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const value = {
    // State values
    selectedFrame,
    selectedBGColor,
    selectedColor,
    selectedFrameColor,
    selectedSocialIcon,
    qrContent,
    inputValue,
    showLoginAlert,
    
    // State setters
    setSelectedFrame,
    setSelectedBGColor,
    setSelectedColor,
    setSelectedFrameColor,
    setSelectedSocialIcon,
    setQrContent,
    setInputValue,
    setShowLoginAlert,
    
    // Helper functions
    handleInputChange,
    handleLoginClick,
    getInputStatus,
    resetDesign,
    resetAll,
    isValidURLRegex,
  };

  return (
    <QRDesignContext.Provider value={value}>
      {children}
    </QRDesignContext.Provider>
  );
};

// Custom hook to use QR Design context
export const useQRDesign = () => {
  const context = useContext(QRDesignContext);
  if (!context) {
    throw new Error('useQRDesign must be used within a QRDesignProvider');
  }
  return context;
};