"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button, Drawer, Image, Layout, Menu, Typography } from "antd";
import { MenuOutlined, CloseOutlined, LogoutOutlined } from "@ant-design/icons";
import styles from "../../../styles/PublicNavbar.module.css";
import Avatar from "./Avatar";
import LoginModal from "../pages/login/LoginModal";
import { continueWithGoogle } from "@/api/auth/api";

const { Header } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "products", label: <Link href="/products">Products</Link> },
  { key: "resources", label: <Link href="/resources">Resources</Link> },
  { key: "plans", label: <Link href="/plans">Plans and prices</Link> },
  { key: "faq", label: <Link href="/faq">FAQ</Link> },
  { key: "api", label: <Link href="/api">API</Link> },
];

const PublicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const loginModalRef = useRef(null);

  // Check for existing auth on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const auth = localStorage.getItem("auth");
        if (auth) {
          const parsedAuth = JSON.parse(auth);
          // Check if token is still valid
          if (parsedAuth.expiry && Date.now() < parsedAuth.expiry) {
            setUser(parsedAuth.user);
          } else {
            // Token expired, remove from localStorage
            localStorage.removeItem("auth");
            setUser(null);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("auth");
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);

    if (loginModalRef.current) {
      loginModalRef.current.clearGoogleSession();
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
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
            setIsModalOpen={setIsModalOpen}
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
          onClose={handleModalClose}
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
