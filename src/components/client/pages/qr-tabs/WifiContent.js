"use client";

import { Form, Input, Row, Col, Select, Switch, Image } from "antd";
import { useState } from "react";
import QRCodeView from "./QRCodeView";

export default function WifiContent() {
  const [form] = Form.useForm();
  const [hiddenNetwork, setHiddenNetwork] = useState(false);

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
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow">
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                ssid: "",
                password: "",
                encryption: "none",
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
                        { value: "none", label: "No encryption" },
                        { value: "wpa", label: "WPA" },
                        { value: "wep", label: "WEP" },
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
              </Row>
            </Form>
          </div>
        </Col>
        <Col span={8} style={{ padding: "10px" }}>
          <QRCodeView />
        </Col>
      </Row>
    </div>
  );
}
