import { Button, Col, Form, Input, message, Row, Tabs } from "antd";
import ColorPicker from "./ColorPicker";
import QRFrameList from "./QRFrameList";
import QRCodeView from "./QRCodeView";
import styled from "styled-components";
import { useCallback, useEffect, useState } from "react";

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
  const [qrContent, setQrContent] = useState("")

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
      children: "Content of Tab Pane 4",
    },
  ];

  // Backend API çağrısı için debounce fonksiyonu
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const generateQRCode = async (content, color, frame) => {
    try {
      const requestBody = {
        type: 1,
        payload: {
          url: content
        },
        designOptions: {
          backgroundColor: color,
          shape: 1,
        },
      };

      console.log("Backend'e gönderilen data:", requestBody);

      // Backend API çağrısı
      const response = await fetch("https://qrgenerates.com/api/QRCode/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setQrCodeUrl(data.qrCodeUrl);
        console.log("Yeni QR kod URL'i:", data.qrCodeUrl);
      } else {
        throw new Error(data.message || "QR kod oluşturulamadı");
      }
    } catch (error) {
      console.error("QR kod generate hatası:", error);
      message.error("QR kod oluşturulurken hata oluştu: " + error.message);
    }
  };

  const debouncedGenerateQR = useCallback(
    debounce((content, colors, frame) => {
      generateQRCode(content, colors, frame);
    }, 500), // 500ms bekle
    []
  );

  // Frame değişikliğini izle
  useEffect(() => {
    if (qrContent) {
      console.log("Frame değişti:", selectedFrame);
      debouncedGenerateQR(qrContent, selectedColor, selectedFrame);
    }
  }, [selectedFrame]);

  // Renk değişikliğini izle
  useEffect(() => {
    if (qrContent) {
      console.log("Renkler değişti:", selectedColor);
      debouncedGenerateQR(qrContent, selectedColor, selectedFrame);
    }
  }, [selectedColor]);

  // İçerik değişikliğini izle
  useEffect(() => {
    if (qrContent) {
      console.log("İçerik değişti:", qrContent);
      debouncedGenerateQR(qrContent, selectedColor, selectedFrame);
    }
  }, [qrContent]);

  // İlk yükleme
  useEffect(() => {
    generateQRCode(qrContent, selectedColor, selectedFrame);
  }, []); // Component mount olduğunda bir kez çalış

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
