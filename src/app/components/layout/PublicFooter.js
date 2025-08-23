import { Row, Col, Input, Button } from "antd"
import Image from "next/image"
import Link from "next/link"
import { ArrowRightOutlined } from "@ant-design/icons";

const menus = [
    {
        key: 1,
        title: "About",
        links: [
            {
                key: 1,
                name: "What We Offer",
                url: "/whatWeOffer"
            },
            {
                key: 2,
                name: "Features",
                url: "/features"
            },
            {
                key: 3,
                name: "Pricing",
                url: "/pricing"
            },
            {
                key: 4,
                name: "Leadership",
                url: "/leadership"
            }
        ]
    },
    {
        key: 2,
        title: "Solutions",
        // links: ["Careers", "Management", "Workflow", "Finance", "Resources"]
        links: [
            {
                key: 1,
                name: "Careers",
                url: "/careers"
            },
            {
                key: 2,
                name: "Management",
                url: "/management"
            },
            {
                key: 3,
                name: "Workflow",
                url: "/workflow"
            },
            {
                key: 4,
                name: "Finance",
                url: "/finance"
            },
            {
                key: 5,
                name: "Resources",
                url: "/resources"
            }
        ]
    },
    {
        key: 3,
        title: "Personal",
        links: [
            {
                key: 1,
                name: "Features",
                url: "/features"
            },
            {
                key: 2,
                name: "Accounts",
                url: "/accounts"
            },
            {
                key: 3,
                name: "Payments",
                url: "/payments"
            },
            {
                key: 4,
                name: "Profile",
                url: "/profile"
            }
        ]
    },
    {
        key: 4,
        title: "Social",
        // links: ["Twitter", "Facebook", "Instagram", "Linkedin"]
        links: [
            {
                key: 1,
                name: "Twitter",
                url: "/twitter"
            },
            {
                key: 2,
                name: "Facebook",
                url: "/facebook"
            },
            {
                key: 3,
                name: "Instagram",
                url: "/instagram"
            },
            {
                key: 4,
                name: "Linkedin",
                url: "/linkedin"
            }
        ]
    }
]

const PublicFooter = () => {
    return (
        <div style={{ background: "#181C25", padding: "46px 20px" }}>
            <Row style={{ justifyContent: "space-between" }}>
                <Col span="4">
                    <Image
                        src="/images/logo_footer.png"
                        alt="qrcodegenerator"
                        width={200}
                        height={200}
                    />
                    <p style={{ marginTop: "20px" }}>No need to worry, we’ll help you make sense of it all..</p>
                    <Input
                        placeholder="Your email"
                        style={{ borderRadius: 6, overflow: "hidden" }}
                        suffix={
                            <Button
                                type="primary"
                                icon={<ArrowRightOutlined />}
                                style={{
                                    background: "#1E5BFF",
                                    border: "none"
                                }}
                            />
                        }
                    />
                </Col>
                {menus.map(menu => {
                    return <Col span="4" key={menu.key} style={{ padding: "0 20px" }}>
                        <p style={{ fontSize: "16px", fontWeight: "600" }}>{menu.title}</p>
                        {menu.links.map(link => <div style={{ margin: "20px 0" }} key={link.key}>
                            <Link href="" style={{ color: "#fff", fontWeight: "400", fontSize: "14px" }} >{link.name}</Link>
                        </div>)}
                    </Col>
                })}
            </Row>
        </div>
    )
}

export default PublicFooter
