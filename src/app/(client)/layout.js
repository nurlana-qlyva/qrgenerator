import { Layout } from "antd";
import FooterWrapper from "../../components/layout/FooterWrapper";
import HeaderWrapper from "../../components/layout/HeaderWrapper";
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
