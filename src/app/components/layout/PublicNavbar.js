"use client";

import Link from "next/link";
import { Layout, Menu, Button } from "antd";
import styled from "styled-components"

const { Header } = Layout;

const PageHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 46px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
`

const MenuLinks = styled(Menu)`
 flex: 1;
 justify-content: center; 
 border-bottom: none;
  .ant-menu-item {
    font-size: 16px;
    font-weight: 500;
    transition : .3s ease all;
  }

   .ant-menu-item:hover::after,
  .ant-menu-item::after {
    border-bottom: none !important;
  }

    .ant-menu-item:hover a {
    color: #1d59f9 !important;
  }
`

const StyledButton = styled(Button)`
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
`

export default function PublicNavbar() {
    return (
        <PageHeader>
            {/* Logo */}
            <div>
                <Link href="/">
                    <img src="./images/logo.png" alt="logo" />
                </Link>
            </div>

            {/* Menü */}
            <MenuLinks
                mode="horizontal"
                defaultSelectedKeys={["home"]}
                items={[
                    { key: "products", label: <Link href="/products">Products</Link> },
                    { key: "resources", label: <Link href="/resources">Resources</Link> },
                    { key: "plans", label: <Link href="/plans">Plans and prices</Link> },
                    { key: "faq", label: <Link href="/faq">FAQ</Link> },
                    { key: "api", label: <Link href="/api">API</Link> },
                ]}
            />

            {/* Login / Register Butonları */}
            <div>
                <Link href="/login">
                    <StyledButton style={{ marginRight: 10 }}>Log in</StyledButton>
                </Link>
                <Link href="/register">
                    <StyledButton type="primary" style={{ background: "#1D59F9" }}>Register</StyledButton>
                </Link>
            </div>
        </PageHeader>
    );
}
