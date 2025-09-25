"use client";
import { useEffect, useState } from "react";

const ColorableFrame = ({ frameSrc, color, style, className }) => {
  const [svgContent, setSvgContent] = useState("");

  useEffect(() => {
    const loadAndColorSVG = async () => {
      if (!frameSrc) return;

      try {
        const response = await fetch(frameSrc);
        let svgText = await response.text();

        if (color) {
          // Sadece gri tonları değiştir, diğer renklere dokunma
          svgText = svgText
            // Açık gri tonları
            .replace(
              /fill="#(C0C0C0|D3D3D3|DCDCDC|E8E8E8|F5F5F5|GAINSBORO|LIGHTGRAY|SILVER)"/gi,
              `fill="${color}"`
            )
            .replace(
              /fill="#(A9A9A9|DARKGRAY|696969|DIMGRAY|2F2F2F|363636)"/gi,
              `fill="${color}"`
            )
            // Hex gri değerleri (eşit RGB değerli)
            .replace(
              /fill="#([0-9A-F])\1([0-9A-F])\2([0-9A-F])\3"/gi,
              `fill="${color}"`
            )
            // RGB gri değerleri
            .replace(/fill="rgb\((\d+),\s*\1,\s*\1\)"/gi, `fill="${color}"`)
            // Stroke için de aynı
            .replace(
              /stroke="#(C0C0C0|D3D3D3|DCDCDC|E8E8E8|F5F5F5|GAINSBORO|LIGHTGRAY|SILVER)"/gi,
              `stroke="${color}"`
            )
            .replace(
              /stroke="#(A9A9A9|DARKGRAY|696969|DIMGRAY|2F2F2F|363636)"/gi,
              `stroke="${color}"`
            )
            .replace(
              /stroke="#([0-9A-F])\1([0-9A-F])\2([0-9A-F])\3"/gi,
              `stroke="${color}"`
            )
            .replace(
              /stroke="rgb\((\d+),\s*\1,\s*\1\)"/gi,
              `stroke="${color}"`
            );
        }

        setSvgContent(svgText);
      } catch (error) {
        console.error("Error loading SVG:", error);
      }
    };

    loadAndColorSVG();
  }, [frameSrc, color]);

  return svgContent ? (
    <div
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  ) : null;
};

export default ColorableFrame;
