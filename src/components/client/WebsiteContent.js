import { useEffect, useState } from "react";
import { Col, Form, Image, Input, Row, Tabs } from "antd";
import QRCodeView from "./QRCodeView.js";
import styled from "styled-components";
import ColorPicker from "./ColorPicker.js";
import QRFrameList from "./QRFrameList.js";
import FileUploadComponent from "./FileUPloadComponent.js";

const TabList = styled(Tabs)`
  &.website-tabs {
    .ant-tabs-nav {
      background: #f5f5f5 !important;
      border-radius: 10px !important;
      justify-content: space-between !important;
      padding: 10px !important;
      gap: 10px !important;
    }
    .ant-tabs-nav-wrap {
      background: #fff !important;
      border-radius: 10px !important;
      padding: 0 10px !important;
    }

    .ant-tabs-content-holder {
      background: #f5f5f5 !important;
      padding: 10px !important;
      border-radius: 10px !important;
    }
    .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
      color: #1d59f9 !important;
      background: #dde2fa !important;
      border: 1px solid transparent !important;
    }
    .ant-tabs-tab-btn {
      min-width: 52px !important;
      background: #fff !important;
      color: #000 !important;
      border-radius: 10px !important;
      border: 1px solid transparent !important;
      padding: 6px 16px !important;
    }
    .ant-tabs-ink-bar {
      display: none !important;
    }
  }
`;

const WebsiteContent = () => {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedBGColor, setSelectedBGColor] = useState("#ffffff");
  const [selectedColor, setSelectedColor] = useState("#000000");
  const [selectedSocialIcon, setSelectedSocialIcon] = useState(null);
  const [qrContent, setQrContent] = useState("");

useEffect(() => console.log(selectedBGColor), [selectedBGColor])

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
          <QRFrameList
            selectedFrame={selectedFrame}
            onFrameSelect={setSelectedFrame}
          />
      ),
    },
    {
      key: "3",
      label: "Shape",
      children: "Content of Tab Pane 3",
    },
    {
      key: "4",
      label: "Logo",
      children: (
        <FileUploadComponent
          onSocialIconSelect={setSelectedSocialIcon}
          selectedSocialIcon={selectedSocialIcon}
        />
      ),
    },
  ];

  // Form içerik değişikliği
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setQrContent(newContent);
  };

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

          <Form layout="vertical">
            <Form.Item label="Your URL">
              <Input
                placeholder="https://www.qrcodegenerator.com"
                onPressEnter={handleContentChange}
              />
            </Form.Item>
          </Form>
          <div>
            <TabList
              className="website-tabs"
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
          />
        </Col>
      </Row>
    </div>
  );
};

export default WebsiteContent;
