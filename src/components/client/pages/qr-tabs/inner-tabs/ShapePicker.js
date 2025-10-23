"use client";

import { useState } from "react";

const bodyShapes = [
  { id: 1, src: "/shapes/body_shape_1.svg" },
  { id: 2, src: "/shapes/body_shape_2.svg" },
  { id: 3, src: "/shapes/body_shape_3.svg" },
  { id: 4, src: "/shapes/body_shape_4.svg" },
];

const eyeFrameShapes = [
  { id: 1, src: "/shapes/frame_shape_1.svg" },
  { id: 2, src: "/shapes/frame_shape_2.svg" },
  { id: 3, src: "/shapes/frame_shape_3.svg" },
  { id: 4, src: "/shapes/frame_shape_4.svg" },
  { id: 5, src: "/shapes/frame_shape_5.svg" },
  { id: 6, src: "/shapes/frame_shape_6.svg" },
  { id: 7, src: "/shapes/frame_shape_7.svg" },
];


export default function ShapePicker() {
  const [selectedBody, setSelectedBody] = useState(1);
  const [selectedFrame, setSelectedFrame] = useState(2);

  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      {/* Body shape */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Body shape</h3>
        <div className="flex gap-3 bg-gray-50 p-3 rounded-lg">
          {bodyShapes.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setSelectedBody(shape.id)}
              className={`${
                selectedBody === shape.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:bg-gray-100"
              } w-12 h-12 flex items-center justify-center rounded-md border transition`}
            >
              <img
                src={shape.src}
                alt={`body-shape-${shape.id}`}
                className="w-7 h-7 object-contain"
              />
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
              onClick={() => setSelectedFrame(shape.id)}
              className={`${
                selectedFrame === shape.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-transparent hover:bg-gray-100"
              } w-12 h-12 flex items-center justify-center rounded-md border transition`}
            >
              <img
                src={shape.src}
                alt={`eye-frame-${shape.id}`}
                className="w-7 h-7 object-contain"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
