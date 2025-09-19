"use client";

import Link from "next/link";
import { Button, Image, Tabs } from "antd";
import styles from "../../styles/HomePage.module.css";

import { Content } from "antd/es/layout/layout";
import WebsiteContent from "@/components/client/pages/qr-tabs/WebsiteContent";
import TextContent from "@/components/client/pages/qr-tabs/TextContent";

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
    children: <WebsiteContent />,
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
    children: <TextContent />,
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
    children: `Content of Tab Pane 3`,
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
    key: "4",
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
    key: "5",
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
    key: "6",
    children: `Content of Tab Pane 6`,
  },
];

export default function Home() {
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
          defaultActiveKey="1"
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
