"use client";

import React, { useState, useRef, useEffect } from "react";

const ColorPicker = () => {
  const [hue, setHue] = useState(250);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(35);
  const [alpha, setAlpha] = useState(100);
  const [colorFormat, setColorFormat] = useState("HEX");
  const [colorValue, setColorValue] = useState("#2622A5");
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);

  const saturationRef = useRef(null);
  const hueRef = useRef(null);

  // Kaydedilmiş renkler
  const [savedColors] = useState([
    "#FF4444",
    "#FF8800",
    "#FFDD00",
    "#AA44FF",
    "#FF88AA",
    "#999999",
    "#AADD00",
    "#884400",
    "#223366",
    "#441144",
    "#6644AA",
    "#448844",
    "#226688",
  ]);

  // HSL to HEX dönüştürme
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  // HSL to RGB dönüştürme
  const hslToRgb = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color);
    };
    return [f(0), f(8), f(4)];
  };

  // HSL to HSV dönüştürme
  const hslToHsv = (h, s, l) => {
    s /= 100;
    l /= 100;
    const v = l + s * Math.min(l, 1 - l);
    const sNew = v === 0 ? 0 : 2 * (1 - l / v);
    return [Math.round(h), Math.round(sNew * 100), Math.round(v * 100)];
  };

  // HEX to HSL dönüştürme
  const hexToHsl = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l;

    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // RGB to HSL dönüştürme
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // HSV to HSL dönüştürme
  const hsvToHsl = (h, s, v) => {
    s /= 100;
    v /= 100;
    const l = (v * (2 - s)) / 2;
    const sNew = l !== 0 && l !== 1 ? (v - l) / Math.min(l, 1 - l) : 0;
    return [h, Math.round(sNew * 100), Math.round(l * 100)];
  };

  // Seçilen formata göre renk değeri döndürme
  const getColorValue = (format, h, s, l, a) => {
    switch (format) {
      case "HEX":
        return hslToHex(h, s, l);
      case "RGB":
        const [r, g, b] = hslToRgb(h, s, l);
        return `rgb(${r}, ${g}, ${b})`;
      case "RGBA":
        const [r2, g2, b2] = hslToRgb(h, s, l);
        return `rgba(${r2}, ${g2}, ${b2}, ${(a / 100).toFixed(2)})`;
      case "HSL":
        return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
      case "HSLA":
        return `hsla(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%, ${(
          a / 100
        ).toFixed(2)})`;
      case "HSV":
        const [hNew, sNew, v] = hslToHsv(h, s, l);
        return `hsv(${hNew}, ${sNew}%, ${v}%)`;
      default:
        return hslToHex(h, s, l);
    }
  };

  // Renk parsing fonksiyonları
  const parseColorValue = (value, format) => {
    try {
      switch (format) {
        case "HEX":
          if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
            return hexToHsl(value);
          }
          break;
        case "RGB":
          const rgbMatch = value.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (rgbMatch) {
            const [, r, g, b] = rgbMatch.map(Number);
            return rgbToHsl(r, g, b);
          }
          break;
        case "RGBA":
          const rgbaMatch = value.match(
            /rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/
          );
          if (rgbaMatch) {
            const [, r, g, b, a] = rgbaMatch;
            setAlpha(parseFloat(a) * 100);
            return rgbToHsl(Number(r), Number(g), Number(b));
          }
          break;
        case "HSL":
          const hslMatch = value.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
          if (hslMatch) {
            const [, h, s, l] = hslMatch.map(Number);
            return [h, s, l];
          }
          break;
        case "HSLA":
          const hslaMatch = value.match(
            /hsla\((\d+),\s*(\d+)%,\s*(\d+)%,\s*([\d.]+)\)/
          );
          if (hslaMatch) {
            const [, h, s, l, a] = hslaMatch;
            setAlpha(parseFloat(a) * 100);
            return [Number(h), Number(s), Number(l)];
          }
          break;
        case "HSV":
          const hsvMatch = value.match(/hsv\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
          if (hsvMatch) {
            const [, h, s, v] = hsvMatch.map(Number);
            return hsvToHsl(h, s, v);
          }
          break;
      }
    } catch (e) {
      console.error("Renk parsing hatası:", e);
    }
    return null;
  };

  // Renk değiştiğinde formatına göre renk değerini güncelle
  useEffect(() => {
    const newColorValue = getColorValue(
      colorFormat,
      hue,
      saturation,
      lightness,
      alpha
    );
    setColorValue(newColorValue);
  }, [hue, saturation, lightness, alpha, colorFormat]);

  // Saturation/Lightness picker için mouse olayları
  const handleSaturationMouseDown = (e) => {
    setIsDragging(true);
    updateSaturationFromMouse(e);
  };

  const handleSaturationMouseMove = (e) => {
    if (isDragging) {
      updateSaturationFromMouse(e);
    }
  };

  const handleSaturationMouseUp = () => {
    setIsDragging(false);
  };

  const updateSaturationFromMouse = (e) => {
    if (saturationRef.current) {
      const rect = saturationRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

      const newSaturation = (x / rect.width) * 100;
      const newLightness = 100 - (y / rect.height) * 100;

      setSaturation(newSaturation);
      setLightness(newLightness);
    }
  };

  // Hue slider için mouse olayları
  const handleHueMouseDown = (e) => {
    setIsHueDragging(true);
    updateHueFromMouse(e);
  };

  const handleHueMouseMove = (e) => {
    if (isHueDragging) {
      updateHueFromMouse(e);
    }
  };

  const handleHueMouseUp = () => {
    setIsHueDragging(false);
  };

  const updateHueFromMouse = (e) => {
    if (hueRef.current) {
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
      const newHue = (x / rect.width) * 360;
      setHue(newHue);
    }
  };

  // Renk input değişikliği
  const handleColorValueChange = (e) => {
    const value = e.target.value;
    setColorValue(value);

    const parsedHsl = parseColorValue(value, colorFormat);
    if (parsedHsl) {
      const [h, s, l] = parsedHsl;
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  };

  // Format değişikliği
  const handleFormatChange = (e) => {
    setColorFormat(e.target.value);
  };

  // Kaydedilmiş renk seçimi
  const selectSavedColor = (color) => {
    const [h, s, l] = hexToHsl(color);
    setHue(h);
    setSaturation(s);
    setLightness(l);
    setAlpha(100); // Kaydedilmiş renkler tam opak
  };

  // Global mouse olayları
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) handleSaturationMouseMove(e);
      if (isHueDragging) handleHueMouseMove(e);
    };

    const handleMouseUp = () => {
      handleSaturationMouseUp();
      handleHueMouseUp();
    };

    if (isDragging || isHueDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isHueDragging]);

  return (
    <div className="bg-gray-50 p-6 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <div className="flex gap-6">
        {/* Sol taraf - Ana renk seçici alanı */}
        <div className="flex-shrink-0">
          <div
            ref={saturationRef}
            className="w-56 h-56 rounded-xl cursor-crosshair relative overflow-hidden"
            style={{
              background: `linear-gradient(to right, white, hsl(${hue}, 100%, 50%)), 
                          linear-gradient(to top, black, transparent)`,
            }}
            onMouseDown={handleSaturationMouseDown}
          >
            {/* Seçici nokta */}
            <div
              className="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                transform: "translate(-50%, -50%)",
                boxShadow:
                  "0 0 0 1px rgba(0,0,0,0.3), inset 0 0 0 1px rgba(255,255,255,0.4)",
              }}
            />
          </div>
        </div>

        {/* Sağ taraf - Kontroller */}
        <div className="flex-1 flex flex-col">
          {/* Hue slider */}
          <div className="mb-6">
            <div
              ref={hueRef}
              className="w-full h-4 rounded-full cursor-pointer relative"
              style={{
                background:
                  "linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)",
              }}
              onMouseDown={handleHueMouseDown}
            >
              {/* Hue seçici */}
              <div
                className="absolute w-6 h-6 bg-white border-2 border-gray-300 rounded-full shadow-lg pointer-events-none"
                style={{
                  left: `${(hue / 360) * 100}%`,
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>

            {/* Alpha slider - RGBA ve HSLA formatları için */}
            {(colorFormat === "RGBA" || colorFormat === "HSLA") && (
              <div className="mt-4">
                <label className="block text-xs text-gray-500 mb-2">
                  Opacity: {Math.round(alpha)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={alpha}
                  onChange={(e) => setAlpha(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, 
                      rgba(${hslToRgb(hue, saturation, lightness).join(
                        ","
                      )}, 0) 0%, 
                      rgba(${hslToRgb(hue, saturation, lightness).join(
                        ","
                      )}, 1) 100%)`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Format selector ve renk input */}
          <div className="mb-6">
            <div className="flex items-center gap-2">
              <select
                className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600"
                value={colorFormat}
                onChange={handleFormatChange}
              >
                <option value="HEX">Hex</option>
                <option value="RGB">RGB</option>
                <option value="RGBA">RGBA</option>
                <option value="HSL">HSL</option>
                <option value="HSLA">HSLA</option>
                <option value="HSV">HSV</option>
              </select>
              <input
                type="text"
                value={colorValue}
                onChange={handleColorValueChange}
                className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm font-mono"
                placeholder={
                  colorFormat === "HEX"
                    ? "#000000"
                    : `${colorFormat.toLowerCase()}(...)`
                }
              />
            </div>
          </div>

          {/* Kaydedilmiş renkler */}
          <div className="flex-1">
            <h3 className="text-gray-600 text-sm font-medium mb-3">
              Saved Colors
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {savedColors.map((color, index) => (
                <button
                  key={index}
                  className="w-8 h-8 rounded-lg shadow-sm border border-gray-200 hover:scale-110 transition-transform cursor-pointer"
                  style={{ backgroundColor: color }}
                  onClick={() => selectSavedColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
