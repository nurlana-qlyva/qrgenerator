"use client";

const qrFrames = [
  {
    id: 1,
    frame: "./frames/1_layer.svg",
    qrPosition: {
      size: 150,
      top: "20%",
      left: "11%",
      transform: "translate(-10%, -50%)",
      scale: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
    },
    socialIconPosition: {
      top: "50%",
      left: "40%",
      transform: "translate(-50%, -50%)",
    },
  },
  {
    id: 2,
    frame: "./frames/2_layer.svg",
    qrPosition: {
      size: 180,
      top: "-5%",
      left: "3%",
      transform: "translate(-50%, -50%)",
      scale: 0.9,
      rotation: 5,
      offsetX: 1,
      offsetY: -2,
    },
    socialIconPosition: {
      top: "35%",
      left: "40%",
      transform: "translate(-35%, -40%)",
    },
  },
  {
    id: 3,
    frame: "./frames/3_layer.svg",
    qrPosition: {
      size: 150,
      top: "0%",
      left: "11%",
      transform: "translate(-50%, -50%)",
      scale: 0.8,
      rotation: -10,
      offsetX: 0,
      offsetY: 5,
    },
    socialIconPosition: {
      top: "30%",
      left: "40%",
      transform: "translate(-30%, -40%)",
    },
  },
  {
    id: 4,
    frame: "./frames/4_layer.svg",
    qrPosition: {
      size: 150,
      top: "-1%",
      left: "11%",
      transform: "translate(-50%, -50%)",
      scale: 1.1,
      rotation: 15,
      offsetX: -5,
      offsetY: 3,
    },
    socialIconPosition: {
      top: "30%",
      left: "40%",
      transform: "translate(-30%, -40%)",
    },
  },
  {
    id: 5,
    frame: "./frames/5_layer.svg",
    qrPosition: {
      size: 140,
      top: "5%",
      left: "14%",
      transform: "translate(-50%, -50%)",
      scale: 0.7,
      rotation: 0,
      offsetX: 8,
      offsetY: -8,
    },
    socialIconPosition: {
      top: "30%",
      left: "40%",
      transform: "translate(-30%, -40%)",
    },
  },
  {
    id: 6,
    frame: "./frames/6_layer.svg",
    qrPosition: {
      size: 150,
      top: "1%",
      left: "10%",
      transform: "translate(-50%, -50%)",
      scale: 1.2,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
    },
    socialIconPosition: {
      top: "30%",
      left: "40%",
      transform: "translate(-30%, -40%)",
    },
  },
  {
    id: 7,
    frame: "./frames/7_layer.svg",
    qrPosition: {
      size: 130,
      top: "1%",
      left: "16%",
      transform: "translate(-50%, -50%)",
      scale: 0.95,
      rotation: 3,
      offsetX: 8,
      offsetY: -2,
    },
    socialIconPosition: {
      top: "27%",
      left: "40%",
      transform: "translate(-27%, -40%)",
    },
  },
];

export default function QRFrameList({ selectedFrame, onFrameSelect }) {
  return (
    <div className="w-full overflow-x-auto py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Hiç frame seçilmemiş seçeneği */}
        <div
          onClick={() => onFrameSelect(null)}
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
            onClick={() => onFrameSelect(frame)}
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
