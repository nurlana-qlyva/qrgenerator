// components/WebsiteContent.js
import { Alert, Col, Form, Image, Input, Row, Tabs } from "antd";
import styles from "../../../../styles/HomePage.module.css";
import ColorPicker from "./inner-tabs/ColorPicker";
import FramePicker from "./inner-tabs/FramePicker";
import QRCodeView from "./QRCodeView";
import LogoPicker from "./inner-tabs/LogoPicker";
import { useQRDesign } from "@/context/QRDesignContext";
import ShapePicker from "./inner-tabs/ShapePicker";

const WebsiteContent = () => {
  const {
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
    setShowLoginAlert,

    // Helper functions
    handleInputChange,
    handleLoginClick,
    getInputStatus,
  } = useQRDesign();

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
          <ColorPicker setColor={setSelectedColor} color={selectedColor} />
          <h4 className="bg-white text-xl p-3 rounded-xl">Background</h4>
          <ColorPicker setColor={setSelectedBGColor} color={selectedBGColor} />
        </div>
      ),
    },
    {
      key: "2",
      label: "Frame",
      children: (
        <div className="flex flex-col gap-10">
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame List</h4>
          <FramePicker
            selectedFrame={selectedFrame}
            onFrameSelect={setSelectedFrame}
          />
          <h4 className="bg-white text-xl p-3 rounded-xl">Frame Color</h4>
          <ColorPicker
            setColor={setSelectedFrameColor}
            color={selectedFrameColor}
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
      children: (
        <LogoPicker
          onSocialIconSelect={setSelectedSocialIcon}
          selectedSocialIcon={selectedSocialIcon}
        />
      ),
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
            <Form.Item
              label="Your URL"
              {...getInputStatus()}
              extra="Enter a URL like example.com or https://example.com"
            >
              <Input value={inputValue} onChange={handleInputChange} />
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
          <QRCodeView
            selectedFrame={selectedFrame}
            selectedBGColor={selectedBGColor}
            selectedColor={selectedColor}
            selectedSocialIcon={selectedSocialIcon}
            qrContent={qrContent}
            selectedFrameColor={selectedFrameColor}
          />
        </Col>
      </Row>
    </div>
  );
};

export default WebsiteContent;
