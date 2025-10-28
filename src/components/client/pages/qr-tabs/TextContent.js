import { useEffect, useState } from "react";
import { Alert, Col, Form, Image, Row, Tabs } from "antd";
import TextArea from "antd/es/input/TextArea.js";
import styles from "../../../../styles/HomePage.module.css";
import ColorPicker from "./inner-tabs/ColorPicker";
import FramePicker from "./inner-tabs/FramePicker";
import QRCodeView from "./QRCodeView";
import LogoPicker from "./inner-tabs/LogoPicker";
import { useQRDesign } from "@/context/QRDesignContext";
import ShapePicker from "./inner-tabs/ShapePicker";
import { getQRCodeService } from "@/api/tabs/api";

const TextContent = ({ tabKey }) => {
  const [qrBase64, setQrBase64] = useState(null);
  const {
    // State values
    showLoginAlert,
    selectedColor,
    setSelectedColor,
    selectedFrameColor,
    setSelectedFrameColor,
    selectedBGColor,
    setSelectedBGColor,
    qrContent,
    selectedFrame,
    selectedSocialIcon,
    textValue,
    selectedShape,
    selectedFinder,

    // State setters
    setShowLoginAlert,

    // Helper functions
    handleTextChange,
  } = useQRDesign();

  const handleGenerate = async () => {
    const body = {
      type: 2,
      payload: {
        Text: textValue,
      },
      designOptions: {
        foregroundColor: selectedColor,
        backgroundColor: selectedBGColor,
        shape: selectedShape,
        logoId: selectedSocialIcon,
        finderStyle: selectedFinder,
        frameForegroundColor: selectedFrameColor,
        frameStyle: selectedFrame?.id || 0,
      },
    };

    if (!!textValue) {
      try {
        const res = await getQRCodeService(body);
        console.log("QR Code Response:", res);

        if (res?.qrCodeBase64) {
          setQrBase64(`data:image/png;base64,${res.qrCodeBase64}`);
          console.log("QR Code generated successfully!");
        } else {
          throw new Error("Invalid response format");
        }

        return res;
      } catch (error) {
        console.error("Generate QR Error:", error);

        if (
          error.message.includes("authentication") ||
          error.message.includes("token")
        ) {
          alert("Please login again to continue.");
        } else {
          alert(`Error: ${error.message}`);
        }
      }
    }
  };

  useEffect(() => {
    if (!qrContent || !selectedBGColor || !selectedColor) {
      return;
    }
    handleGenerate();
  }, [
    selectedFrame,
    selectedFrameColor,
    selectedBGColor,
    selectedColor,
    selectedSocialIcon,
    qrContent,
  ]);

  const title = (
    <div
      className="flex items-center gap-3"
      style={{ flex: 1, textAlign: "center" }}
    >
      <Image src="./icons/design.svg" alt="qr code content" width={30} />
      <h3 style={{ margin: "0" }}>Design your Qr</h3>
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Color",
      children: (
        <div className="flex flex-col gap-10">
          <h4 className="bg-white text-xl p-3 rounded-xl">Color</h4>
          <ColorPicker color={selectedColor} setColor={setSelectedColor} />
          <h4 className="bg-white text-xl p-3 rounded-xl">Background</h4>
          <ColorPicker color={selectedBGColor} setColor={setSelectedBGColor} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Frame",
      children: (
        <div className="flex flex-col gap-10">
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame List</h4>
          <FramePicker />
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame Color</h4>
          <ColorPicker
            color={selectedFrameColor}
            setColor={setSelectedFrameColor}
          />
        </div>
      ),
    },
    {
      key: "3",
      label: "Shape",
      children: <ShapePicker />,
    },
    {
      key: "4",
      label: "Logo",
      children: <LogoPicker />,
    },
  ];

  return (
    <div style={{ background: "#fff" }}>
      <Row>
        <Col span="16">
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              background: "#F5F5F5",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            <Image src="./icons/content.svg" alt="qr code content" width={20} />
            <h2>Enter your content</h2>
          </div>

          {showLoginAlert && (
            <Alert
              message="Login Required"
              description="Please login to generate QR codes for your URLs."
              type="warning"
              showIcon
              closable
              onClose={() => setShowLoginAlert(false)}
              style={{ marginBottom: "16px" }}
            />
          )}

          <Form layout="vertical">
            <Form.Item label="Your text">
              <TextArea value={textValue} onChange={handleTextChange} />
            </Form.Item>
          </Form>
          <div>
            <Tabs
              className={styles.designTabs}
              tabBarExtraContent={{
                left: title,
              }}
              items={items}
            />
          </div>
        </Col>
        <Col span={8} style={{ padding: "10px" }}>
          <QRCodeView qrBase64={qrBase64} />
        </Col>
      </Row>
    </div>
  );
};

export default TextContent;
