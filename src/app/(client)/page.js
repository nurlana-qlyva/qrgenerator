"use client";
import { Button, Layout, Tabs } from "antd";
import Link from "next/link";
import styles from "../../styles/HomePage.module.css";
import WebsiteContent from "@/components/client/WebsiteContent";
import styled from "styled-components";

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
    <Content className={styles.content}>
      <div
        className={styles.hero}
        style={{
          background: `linear-gradient(rgba(255, 255, 255, 0.01), rgba(255, 255, 255, 0.01)), url(./images/hero.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className={styles.title}>
          We make <span className={styles.highlight}>QR codes</span> easy.
        </h1>
        <p className={styles.description}>
          Easily
          <span className={styles.highlight}>
            generate, manage and statistically
          </span>
          track your QR codes
        </p>
        <Link href="/">
          <Button type="primary" className={styles.heroButton}>
            Create QR Code
          </Button>
        </Link>
      </div>

      <div className={styles.tab}>
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
