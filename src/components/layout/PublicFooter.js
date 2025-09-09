import { Row, Col, Input, Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightOutlined } from "@ant-design/icons";
import styles from "../../styles/PublicFooter.module.css";

const menus = [
  {
    key: 1,
    title: "About",
    links: [
      {
        key: 1,
        name: "What We Offer",
        url: "/whatWeOffer",
      },
      {
        key: 2,
        name: "Features",
        url: "/features",
      },
      {
        key: 3,
        name: "Pricing",
        url: "/pricing",
      },
      {
        key: 4,
        name: "Leadership",
        url: "/leadership",
      },
    ],
  },
  {
    key: 2,
    title: "Solutions",
    links: [
      {
        key: 1,
        name: "Careers",
        url: "/careers",
      },
      {
        key: 2,
        name: "Management",
        url: "/management",
      },
      {
        key: 3,
        name: "Workflow",
        url: "/workflow",
      },
      {
        key: 4,
        name: "Finance",
        url: "/finance",
      },
      {
        key: 5,
        name: "Resources",
        url: "/resources",
      },
    ],
  },
  {
    key: 3,
    title: "Personal",
    links: [
      {
        key: 1,
        name: "Features",
        url: "/features",
      },
      {
        key: 2,
        name: "Accounts",
        url: "/accounts",
      },
      {
        key: 3,
        name: "Payments",
        url: "/payments",
      },
      {
        key: 4,
        name: "Profile",
        url: "/profile",
      },
    ],
  },
  {
    key: 4,
    title: "Social",
    links: [
      {
        key: 1,
        name: "Twitter",
        url: "/twitter",
      },
      {
        key: 2,
        name: "Facebook",
        url: "/facebook",
      },
      {
        key: 3,
        name: "Instagram",
        url: "/instagram",
      },
      {
        key: 4,
        name: "Linkedin",
        url: "/linkedin",
      },
    ],
  },
];

const PublicFooter = () => {
  return (
    <div style={{display: "flex", justifyContent: "center"}}>
      <div className={styles.footerContainer}>
        <Row gutter={[32, 32]} className={styles.footerRow}>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            <div className={styles.logoSection}>
              <Image
                src="/images/logo_footer.png"
                alt="qrcodegenerator"
                width={200}
                height={200}
                className={styles.logoImage}
              />
              <p style={{ marginTop: "20px" }}>
                No need to worry, we'll help you make sense of it all..
              </p>
              <div className={styles.emailSection}>
                <Input
                  placeholder="Your email"
                  className={styles.styledInput}
                  suffix={
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      className={styles.emailButton}
                    />
                  }
                />
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={18}>
            <Row gutter={[32, 32]} className={styles.menuRow}>
              {menus.map((menu) => (
                <Col key={menu.key} xs={12} sm={12} md={6} lg={6} xl={6}>
                  <div className={styles.menuSection}>
                    <p className={styles.menuTitle}>{menu.title}</p>
                    {menu.links.map((link) => (
                      <div key={link.key} className={styles.menuLink}>
                        <Link href={link.url}>{link.name}</Link>
                      </div>
                    ))}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default PublicFooter;
