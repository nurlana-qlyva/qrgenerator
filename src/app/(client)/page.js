"use client"
import { Button, Layout, Tabs } from "antd";
import Link from "next/link";
import styled from "styled-components";
import WebsiteContent from "../components/pages/client/home/WebsiteContent"

const { Content } = Layout;

const TabList = styled(Tabs)`
  .ant-tabs-nav {
    background: #fff !important;
    padding: 0 10px !important;
    border-radius: 10px !important;
  }

  .ant-tabs-content-holder {
    background: #fff !important;
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
    border: 1px solid #e5e5e5 !important;
    padding: 6px 16px !important;
  }
  .ant-tabs-ink-bar {
    display: none !important;
  }
`;

const StyledButton = styled(Button)`
  &.hero {
    min-width: 132px !important;
    min-height: 40px !important;
    font-weight: 500 !important;

    ${({ type }) =>
      type === "primary" &&
      `
        background: #1d59f9 !important;
        border-color: #1d59f9 !important;

            &:hover {
                background: #1548c7 !important;
                border-color: #1548c7 !important;
            }
        `}
  }
`;

const StyledHero = styled.div`
  background: #fff !important;

  &.hero {
    padding: 60px 10px !important;
    border-radius: 10px;
    margin-bottom: 10px;
    text-align: center;
    color: #181c25;

    h1 {
      font-size: 48px;

      span {
        color: #1d59f9;
      }
    }

    p {
      font-size: 16px;
      font-weight: 500;

      span {
        color: #1d59f9;
      }
    }
  }
`;

const items = [
  { label: `Website`, key: "1", children: <WebsiteContent /> },
  { label: `Text`, key: "2", children: `Content of Tab Pane 2` },
  { label: `Vcard`, key: "3", children: `Content of Tab Pane 3` },
  { label: `PDF`, key: "4", children: `Content of Tab Pane 4` },
  { label: `Images`, key: "5", children: `Content of Tab Pane 5` },
  { label: `Videos`, key: "6", children: `Content of Tab Pane 6` },
  { label: `Wifi`, key: "7", children: `Content of Tab Pane 7` },
  { label: `Location`, key: "8", children: `Content of Tab Pane 8` },
  { label: `Event`, key: "9", children: `Content of Tab Pane 9` },
  { label: `App`, key: "10", children: `Content of Tab Pane 10` },
  { label: `Phone`, key: "11", children: `Content of Tab Pane 11` },
];

const HomePage = () => {
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <Content style={{ padding: "10px" }}>
      <StyledHero className="hero">
        <h1>
          We make <span>QR codes</span> easy.
        </h1>
        <p>
          Easily <span>generate, manage and statistically</span> track your QR
          codes
        </p>
        <Link href="/">
          <StyledButton type="primary" style={{ background: "#1D59F9" }}>
            Create QR Code
          </StyledButton>
        </Link>
      </StyledHero>
      <div
        style={{ background: "#E7E7EA", padding: "10px", borderRadius: "10px" }}
      >
        <TabList
          defaultActiveKey="1"
          onChange={onChange}
          items={items}
          tabBarGutter={4}
          type="line"
          tabBarStyle={{ overflow: "hidden" }}
          moreIcon="..."
        />
      </div>
    </Content>
  );
};

export default HomePage;
