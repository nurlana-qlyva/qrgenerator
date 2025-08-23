import { Button, Col, Form, Input, Row, Tabs } from "antd";
import ColorPicker from "./ColorPicker";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

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

const StyledButton = styled(Button)`
  &.website-btns {
    min-width: 132px !important;
    min-height: 40px !important;
    font-weight: 500 !important;
    display: inline-block !important;
    width: 100% !important;
    max-width: 400px !important;

    ${({ type }) =>
      type === "primary" &&
      `
      background: #1d59f9 !important;
      border-color: #1d59f9 !important;
      margin-top: 10px !important;

      &:hover {
        background: #1548c7 !important;
        border-color: #1548c7 !important;
      }
    `}
  }
`;

const title = (
  <div style={{ flex: 1, textAlign: "center" }}>
    <h3 style={{ margin: "0" }}>Design your Qr</h3>
  </div>
);

const items = [
  {
    key: "1",
    label: "Tab 1",
    children: <ColorPicker />,
  },
  {
    key: "2",
    label: "Tab 2",
    children: "Content of Tab Pane 2",
  },
  {
    key: "3",
    label: "Tab 3",
    children: "Content of Tab Pane 3",
  },
];

const WebsiteContent = () => {
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
              <Input placeholder="https://www.qrcodegenerator.com" />
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
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "300px",
              marginBottom: "20px",
            }}
          >
            <Image
              src="/images/qrcode.png"
              alt="QR Code"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <div
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Link href="/login">
              <StyledButton className="website-btns">
                Create QR code
              </StyledButton>
            </Link>
            <Link href="/register">
              <StyledButton className="website-btns" type="primary">
                Download QR code
              </StyledButton>
            </Link>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default WebsiteContent;
