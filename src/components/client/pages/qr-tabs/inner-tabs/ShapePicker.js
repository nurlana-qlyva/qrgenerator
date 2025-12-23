"use client";

import { useQRDesign } from "@/context/QRDesignContext";

const bodyShapes = [
  { id: 0, src: null, label: "None" },
  { id: 1, src: "/shapes/body_shape_1.svg" },
  { id: 2, src: "/shapes/body_shape_2.svg" },
  { id: 3, src: "/shapes/body_shape_3.svg" },
  { id: 4, src: "/shapes/body_shape_4.svg" },
];

const eyeFrameShapes = [
  { id: 0, src: null, label: "None" },
  { id: 1, src: "/shapes/frame_shape_1.svg" },
  { id: 2, src: "/shapes/frame_shape_2.svg" },
  { id: 3, src: "/shapes/frame_shape_3.svg" },
  { id: 4, src: "/shapes/frame_shape_4.svg" },
  { id: 5, src: "/shapes/frame_shape_5.svg" },
  { id: 6, src: "/shapes/frame_shape_6.svg" },
  { id: 7, src: "/shapes/frame_shape_7.svg" },
];

export default function ShapePicker() {
  const { selectedFinder, selectedShape, setSelectedFinder, setSelectedShape } =
    useQRDesign();

  return (
    <div className="w-full p-6 bg-white rounded-[11px]">
      {/* Body shape */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Body shape</h3>
        <div className="flex gap-3 bg-gray-50 p-3 rounded-lg">
          {bodyShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setSelectedShape(shape.id)}
              className={`${
                selectedShape === shape.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:bg-gray-100"
              } w-12 h-12 flex items-center justify-center rounded-md border transition`}
            >
              {shape.src ? (
                <img
                  src={shape.src}
                  alt={`body-shape-${shape.id}`}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500 font-medium">None</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Eye frame shape */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Eye frame shape
        </h3>
        <div className="flex gap-3 bg-gray-50 p-3 rounded-lg">
          {eyeFrameShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setSelectedFinder(shape.id)}
              className={`${
                selectedFinder === shape.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:bg-gray-100"
              } w-12 h-12 flex items-center justify-center rounded-md border transition`}
            >
              {shape.src ? (
                <img
                  src={shape.src}
                  alt={`eye-frame-${shape.id}`}
                  className="w-7 h-7 object-contain"
                />
              ) : (
                <span className="text-xs text-gray-500 font-medium">None</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
