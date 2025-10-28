"use client";

import React, { useState } from "react"; // Import React and useState
import Link from "next/link";
import { Button, Image, Tabs } from "antd";
import styles from "../../styles/HomePage.module.css";

import { Content } from "antd/es/layout/layout";
import WebsiteContent from "@/components/client/pages/qr-tabs/WebsiteContent";
import TextContent from "@/components/client/pages/qr-tabs/TextContent";
import VCardContent from "@/components/client/pages/qr-tabs/VCardContent";
import WifiContent from "@/components/client/pages/qr-tabs/WifiContent";
import { useQRDesign } from "@/context/QRDesignContext";

export default function Home() {
  const [tabKey, setTabKey] = useState("1"); // Note: changed setTabkey to setTabKey (capital K)
  const { resetAll } = useQRDesign();

  const onChange = (key) => {
    console.log(key);
    setTabKey(key); // Changed to setTabKey
    resetAll();
  };

  const items = [
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/www.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          Website
        </div>
      ),
      key: "1",
      children: <WebsiteContent key={tabKey} tabKey={tabKey} />,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/letter.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          Text
        </div>
      ),
      key: "2",
      children: <TextContent key={tabKey} tabKey={tabKey} />,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/id.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          VCard
        </div>
      ),
      key: "3",
      children: <VCardContent key={tabKey} />,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/wifi.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          Wifi
        </div>
      ),
      key: "4",
      children: <WifiContent key={tabKey} />,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/pdf.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          PDF
        </div>
      ),
      key: "5",
      children: `Content of Tab Pane 4`,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/picture.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          Images
        </div>
      ),
      key: "6",
      children: `Content of Tab Pane 5`,
    },
    {
      label: (
        <div className="flex items-center gap-3">
          <Image
            src="./icons/video.svg"
            alt="qr code url"
            preview={false}
            width={20}
          />
          Videos
        </div>
      ),
      key: "7",
      children: `Content of Tab Pane 6`,
    },
  ];

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
            <Image
              src="./icons/qr.svg"
              alt="qr code generator"
              preview={false}
            />{" "}
            Create QR Code
          </Button>
        </Link>
      </div>

      <div className={styles.tab}>
        <Tabs
          activeKey={tabKey}
          destroyInactiveTabPane={true}
          onChange={onChange}
          items={items}
          tabBarGutter={4}
          type="line"
          tabBarStyle={{ overflow: "hidden" }}
          moreIcon="..."
          className={styles.customTabs}
        />
      </div>
    </Content>
  );
}