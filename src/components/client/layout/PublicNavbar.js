"use client";

import { useState } from "react";
import Link from "next/link";
import { Button, Drawer, Image, Layout, Menu, Typography } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import styles from "../../../styles/PublicNavbar.module.css";
import Avatar from "./Avatar";
import LoginModal from "../pages/login/LoginModal";
import { useAuth } from "@/context/AuthContext";

const { Header } = Layout;

const menuItems = [
  { key: "products", label: <Link href="/products">Products</Link> },
  { key: "resources", label: <Link href="/resources">Resources</Link> },
  { key: "plans", label: <Link href="/plans">Plans and prices</Link> },
  { key: "faq", label: <Link href="/faq">FAQ</Link> },
  { key: "api", label: <Link href="/api">API</Link> },
];

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    user,
    isModalOpen,
    loginModalRef,
    openLoginModal,
    closeLoginModal,
    handleLoginSuccess,
    handleLogout,
  } = useAuth();

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

        {/* Desktop Menu */}
        <Menu
          mode="horizontal"
          defaultSelectedKeys={["products"]}
          items={menuItems}
          className={styles.desktopMenu}
        />

        {/* Desktop Login / Register */}
        <div className={styles.desktopUserButton}>
          <Avatar
            user={user}
            setIsModalOpen={openLoginModal} // Bu şekilde güncelleyin
            onLogout={handleLogout}
          />
        </div>

        {/* Mobile Menu Button */}
        <Button
          type="text"
          icon={<MenuOutlined style={{ fontSize: "20px" }} />}
          onClick={toggleMobileMenu}
          className={styles.mobileMenuButton}
        />

        {/* Login Modal */}
        <LoginModal
          ref={loginModalRef}
          open={isModalOpen}
          onClose={closeLoginModal}
          onLoginSuccess={handleLoginSuccess}
        />
      </Header>

      {/* Mobile Drawer Menu */}
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
      </Drawer>
    </>
  );
};

export default PublicNavbar;
