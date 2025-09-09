import { Layout } from "antd";
import FooterWrapper from "../../components/layout/FooterWrapper.js";
import HeaderWrapper from "../../components/layout/HeaderWrapper.js";
import "../globals.css";

export default function PublicLayout({ children }) {
  return (
    <html>
      <body>
        <Layout style={{ minHeight: "100vh" }}>
          <HeaderWrapper />
          {children}
          <FooterWrapper />
        </Layout>
      </body>
    </html>
  );
}
