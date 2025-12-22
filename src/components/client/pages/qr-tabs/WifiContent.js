"use client";

import {
  Form,
  Input,
  Row,
  Col,
  Select,
  Switch,
  Image,
  Tabs,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import styles from "../../../../styles/HomePage.module.css";
import QRCodeView from "./QRCodeView";
import { useQRDesign } from "@/context/QRDesignContext";
import LogoPicker from "./inner-tabs/LogoPicker";
import ShapePicker from "./inner-tabs/ShapePicker";
import FramePicker from "./inner-tabs/FramePicker";
import ColorPicker from "./inner-tabs/ColorPicker";
import { getQRCodeService } from "@/api/tabs/api";

export default function WifiContent() {
  const [form] = Form.useForm();
  const [hiddenNetwork, setHiddenNetwork] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [qrBase64, setQrBase64] = useState(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false); // ✅ Eklendi

  const {
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
    selectedShape,
    selectedFinder,
    setShowLoginAlert,
  } = useQRDesign();

  const handleGenerate = async () => {
    const values = form.getFieldsValue();
    const body = {
      type: 3,
      payload: {
        ssid: values.ssid,
        password: values.password,
        security: values.encryption,
        hidden: hiddenNetwork,
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

    setIsLoading(true);
    setQrBase64(null);

    try {
      const res = await getQRCodeService(body);
      console.log("✅ QR Code Response:", res);

      if (res?.qrCodeBase64) {
        setQrBase64(`data:image/png;base64,${res.qrCodeBase64}`);
        setHasGeneratedOnce(true); // ✅ İlk generate yapıldı
        console.log("✅ QR Code generated successfully!");
      } else {
        throw new Error("Invalid response format");
      }

      return res;
    } catch (error) {
      console.error("❌ Generate QR Error:", error);

      if (
        error.message.includes("authentication") ||
        error.message.includes("token")
      ) {
        alert("Please login again to continue.");
      } else {
        alert(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Design değişikliklerinde otomatik generate (sadece ilk generate'den sonra)
  useEffect(() => {
    if (!hasGeneratedOnce) return; // İlk generate yapılmamışsa çalışma
    if (!selectedBGColor || !selectedColor) return;

    console.log("🎨 Design changed, regenerating QR...");
    handleGenerate();
  }, [
    selectedFrame,
    selectedFrameColor,
    selectedBGColor,
    selectedColor,
    selectedSocialIcon,
    selectedShape,
    selectedFinder,
    hasGeneratedOnce, // ✅ Dependency eklendi
  ]);

  const items = [
    {
      key: "1",
      label: "Color",
      children: (
        <div className="flex gap-2">
          <div className="w-[50%]">
            <h4 className="bg-white text-[14px] p-3 rounded-xl">Color</h4>
            <ColorPicker color={selectedColor} setColor={setSelectedColor} />
          </div>
          <div className="w-[50%]">
            <h4 className="bg-white text-[14px] p-3 rounded-xl">Background</h4>
            <ColorPicker
              color={selectedBGColor}
              setColor={setSelectedBGColor}
            />
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Frame",
      children: (
        <div className="flex flex-col gap-2">
          <h4 className="bg-white text-[14px] p-3 rounded-xl">Frame List</h4>
          <FramePicker />
          <h4 className="bg-white text-[14px] p-3 rounded-xl">Frame Color</h4>
          <div className="w-[50%]">
            <ColorPicker
              color={selectedFrameColor}
              setColor={setSelectedFrameColor}
            />
          </div>
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

  const title = (
    <div
      className="flex items-center gap-3"
      style={{ flex: 1, textAlign: "center" }}
    >
      <Image src="./icons/design.svg" alt="qr code content" width={30} />
      <h3 style={{ margin: "0" }}>Design your Qr</h3>
    </div>
  );

  return (
    <div style={{ background: "#fff" }}>
      <Row>
        <Col span="16">
          <div
            className="flex items-center gap-3 mb-4"
            style={{
              background: "#F5F5F5",
              padding: "10px",
              borderRadius: "11px",
            }}
          >
            <Image src="./icons/content.svg" alt="qr code content" width={20} />
            <h2>Enter your content</h2>
          </div>
          <div className="p-4 bg-white">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ssid: "",
                password: "",
                encryption: "NOPASS",
              }}
            >
              {/* SSID and Password */}
              <Row gutter={12}>
                <Col span={12}>
                  <Form.Item
                    label="Wireless SSID"
                    name="ssid"
                    className="mb-4"
                    rules={[{ required: true, message: "Please enter SSID" }]}
                  >
                    <Input placeholder="SSID" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Wireless password"
                    name="password"
                    className="mb-4"
                  >
                    <Input.Password placeholder="Password" />
                  </Form.Item>
                </Col>
              </Row>

              {/* Encryption & Hidden network */}
              <Row gutter={12} align="middle">
                <Col span={12}>
                  <Form.Item
                    label="Encryption"
                    name="encryption"
                    className="mb-0"
                  >
                    <Select
                      options={[
                        { value: "NOPASS", label: "No encryption" },
                        { value: "WPA", label: "WPA" },
                        { value: "WEP", label: "WEP" },
                      ]}
                      placeholder="Select encryption"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <div className="flex items-center gap-2 mt-6">
                    <Switch
                      checked={hiddenNetwork}
                      onChange={(checked) => setHiddenNetwork(checked)}
                    />
                    <span className="text-gray-700">Hidden network</span>
                  </div>
                </Col>
                <Col span={24}>
                  <Button
                    onClick={handleGenerate}
                    disabled={isLoading} // ✅ Loading sırasında disable
                    className="text-center gap-2 px-4 py-2 bg-[#fff] rounded-[11px] hover:bg-blue-600 transition-colors font-medium w-full"
                  >
                    {isLoading ? "Creating..." : "Create QR"} {/* ✅ Loading feedback */}
                  </Button>
                </Col>
              </Row>
            </Form>
            <div className="mt-6">
              <Tabs
                className={styles.designTabs}
                tabBarExtraContent={{
                  left: title,
                }}
                items={items}
              />
            </div>
          </div>
        </Col>
        <Col span={8} className="px-[24px]">
          <QRCodeView qrBase64={qrBase64} isLoading={isLoading} />
        </Col>
      </Row>
    </div>
  );
}