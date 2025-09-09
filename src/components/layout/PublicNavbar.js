"use client";

import { useState } from "react";
import Link from "next/link";
import { Layout, Menu, Button, Drawer, Image } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../styles/PublicNavbar.module.css";

const { Header } = Layout;

const menuItems = [
  { key: "products", label: <Link href="/products">Products</Link> },
  { key: "resources", label: <Link href="/resources">Resources</Link> },
  { key: "plans", label: <Link href="/plans">Plans and prices</Link> },
  { key: "faq", label: <Link href="/faq">FAQ</Link> },
  { key: "api", label: <Link href="/api">API</Link> },
];

export default function PublicNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <Header className={styles.pageHeader}>
        {/* Logo */}
        <div className={styles.logoContainer}>
          <Link href="/">
            <Image
              src="./images/logo.png"
              alt="qr generator logo"
              preview={false}
              className={styles.logoImage}
            />
          </Link>
        </div>

        {/* Desktop Menü */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["products"]}
          items={menuItems}
          className={styles.desktopMenu}
        />

        {/* Desktop Login / Register Butonları */}
        <div className={styles.desktopButtons}>
          <Link href="/login">
            <Button className={styles.styledButton}>Log in</Button>
          </Link>
          <Link href="/register">
            <Button
              type="primary"
              className={`${styles.styledButton} ${styles.primaryButton}`}
            >
              Register
            </Button>
          </Link>
        </div>

        {/* Mobile Menü Butonu */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: "20px" }} />}
          onClick={toggleMobileMenu}
          className={styles.mobileMenuButton}
        />
      </Header>

      {/* Mobile Drawer Menü */}
      <Drawer
        title={null}
        placement="right"
        onClose={closeMobileMenu}
        open={mobileMenuOpen}
        closable={false}
        width={280}
        styles={{
          body: { padding: 0 },
        }}
      >
        <div className={styles.drawerHeader}>
          <Link href="/" onClick={closeMobileMenu}>
            <Image
              src="./images/logo.png"
              alt="qr generator logo"
              preview={false}
              style={{ height: "35px" }}
            />
          </Link>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={closeMobileMenu}
            style={{ border: "none", boxShadow: "none" }}
          />
        </div>

        <Menu
          mode="vertical"
          items={menuItems.map((item) => ({
            ...item,
            label: <div onClick={closeMobileMenu}>{item.label}</div>,
          }))}
          className={styles.mobileMenu}
        />

        <div className={styles.mobileButtons}>
          <Link href="/login" onClick={closeMobileMenu}>
            <Button className={styles.styledButton}>Log in</Button>
          </Link>
          <Link href="/register" onClick={closeMobileMenu}>
            <Button
              type="primary"
              className={`${styles.styledButton} ${styles.primaryButton}`}
            >
              Register
            </Button>
          </Link>
        </div>
      </Drawer>
    </>
  );
}
