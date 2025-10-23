"use client";

import { useQRDesign } from "@/context/QRDesignContext";

const qrFrames = [
  {
    id: 1,
    frame: "./frames/1_layer.svg",
  },
  {
    id: 2,
    frame: "./frames/2_layer.svg",
  },
  {
    id: 3,
    frame: "./frames/3_layer.svg",
  },
  {
    id: 4,
    frame: "./frames/4_layer.svg",
  },
  {
    id: 5,
    frame: "./frames/5_layer.svg",
  },
  {
    id: 6,
    frame: "./frames/6_layer.svg",
  },
  {
    id: 7,
    frame: "./frames/7_layer.svg",
  },
];

export default function FramePicker() {
  const { selectedFrame, setSelectedFrame } = useQRDesign();
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Hiç frame seçilmemiş seçeneği */}
        <div
          onClick={() => setSelectedFrame(null)}
          className={`min-w-[100px] p-2 rounded-lg cursor-pointer border-2 border-dashed ${
            selectedFrame === null
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          } flex justify-center`}
        >
          <div className="w-24 h-24 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <div className="text-2xl mb-1">+</div>
              <div className="text-xs">No Frame</div>
            </div>
          </div>
        </div>

        {/* Frame seçenekleri */}
        {qrFrames.map((frame) => (
          <div
            key={frame.id}
            onClick={() => setSelectedFrame(frame)}
            className={`min-w-[100px] p-2 rounded-lg cursor-pointer border-2 transition-all ${
              selectedFrame?.id === frame.id
                ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50"
                : "border-gray-300 hover:border-gray-400 hover:shadow-md"
            } flex justify-center`}
          >
            <img
              src={frame.frame}
              alt={`QR Frame ${frame.id}`}
              className="w-24 h-24 object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
