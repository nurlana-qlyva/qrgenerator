"use client";

import { Form, Input, Row, Col, Image, Tabs } from "antd";
import styles from "../../../../styles/HomePage.module.css";
import ColorPicker from "./inner-tabs/ColorPicker";
import FramePicker from "./inner-tabs/FramePicker";
import QRCodeView from "./QRCodeView";
import LogoPicker from "./inner-tabs/LogoPicker";
import { useState } from "react";

export default function VCardContent() {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFrameColor, setSelectedFrameColor] = useState("#000000");
  const [selectedBGColor, setSelectedBGColor] = useState("#ffffff");
  const [selectedSocialIcon, setSelectedSocialIcon] = useState(null);
  const [qrContent, setQrContent] = useState("");

  const [form] = Form.useForm();

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
      children: "Content of Tab Pane 3",
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
          <div className="max-w-2xl mx-auto p-4">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                firstname: "",
                lastname: "",
                mobile: "",
                phone: "",
                fax: "",
                email: "",
                company: "",
                job: "",
                street: "",
                city: "",
                state: "",
                country: "",
                website: "",
              }}
            >
              {/* Name */}
              <Form.Item label="Your name" className="mb-3">
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="firstname" noStyle>
                      <Input placeholder="Firstname" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="lastname" noStyle>
                      <Input placeholder="Lastname" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Contact */}
              <Form.Item label="Contact" className="mb-3">
                <Row gutter={[12, 12]}>
                  <Col span={24}>
                    <Form.Item name="mobile" noStyle>
                      <Input placeholder="Mobile" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="phone" noStyle>
                      <Input placeholder="Phone" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="fax" noStyle>
                      <Input placeholder="Fax" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item name="email" noStyle>
                      <Input placeholder="youremail@mail.com" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Company */}
              <Form.Item label="Company" className="mb-3">
                <Row gutter={12}>
                  <Col span={12}>
                    <Form.Item name="company" noStyle>
                      <Input placeholder="Company name" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="job" noStyle>
                      <Input placeholder="Your job" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Address */}
              <Form.Item label="Address" className="mb-3">
                <Row gutter={[12, 12]}>
                  <Col span={12}>
                    <Form.Item name="street" noStyle>
                      <Input placeholder="Street" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="city" noStyle>
                      <Input placeholder="City" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="state" noStyle>
                      <Input placeholder="State" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item name="country" noStyle>
                      <Input placeholder="Country" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>

              {/* Website */}
              <Form.Item label="Website">
                <Input placeholder="www.example.com" />
              </Form.Item>
            </Form>
          </div>
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
}
