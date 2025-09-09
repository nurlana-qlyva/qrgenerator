import { useCallback, useEffect, useState } from "react";
import { Col, Form, Input, message, Row, Tabs } from "antd";
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
  const [selectedColor, setSelectedColor] = useState("");
  const [qrContent, setQrContent] = useState("");

  const title = (
    <div style={{ flex: 1, textAlign: "center" }}>
      <h3 style={{ margin: "0" }}>Design your Qr</h3>
    </div>
  );

  const items = [
    {
      key: "1",
      label: "Color",
      children: <ColorPicker onColorChange={setSelectedColor} />,
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
      children: <FileUploadComponent />,
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
          <h2
            style={{
              background: "#F5F5F5",
              padding: "10px",
              borderRadius: "10px",
            }}
          >
            Enter your content
          </h2>
          <Form layout="vertical">
            <Form.Item label="Your email">
              <Input
                placeholder="https://www.qrcodegenerator.com"
                onChange={handleContentChange}
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
            selectedColors={selectedColor}
          />
        </Col>
      </Row>
    </div>
  );
};

export default WebsiteContent;
