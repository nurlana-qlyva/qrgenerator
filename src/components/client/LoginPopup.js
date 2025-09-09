import React, { useState } from "react";
import { Modal, Form, Input, Button, message, Tabs } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";

const LoginPopup = ({ open, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  // Login işlemi
  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success("Login successful!");

        // Token'ı localStorage'a kaydet
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Login başarılı callback'i çağır
        onLoginSuccess(data);

        // Form'u temizle
        loginForm.resetFields();
        setActiveTab("login"); // Tab'ı reset et
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error(error.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Register işlemi
  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        message.success(
          "Registration successful! Please login with your credentials."
        );
        setActiveTab("login"); // Login tab'ına geç
        registerForm.resetFields();
        
        // Register sonrası login form'unu doldur
        loginForm.setFieldsValue({
          email: values.email,
          password: '', // Güvenlik için password'u boş bırak
        });
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Register error:", error);
      message.error(error.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Modal kapanırken form'ları temizle
  const handleModalClose = () => {
    loginForm.resetFields();
    registerForm.resetFields();
    setActiveTab("login");
    setLoading(false);
    onClose();
  };

  const loginTab = (
    <div className="p-4">
      <Form
        form={loginForm}
        name="login"
        onFinish={handleLogin}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const registerTab = (
    <div className="p-4">
      <Form
        form={registerForm}
        name="register"
        onFinish={handleRegister}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[
            { required: true, message: "Please input your name!" },
            { min: 2, message: "Name must be at least 2 characters!" },
          ]}
        >
          <Input 
            prefix={<UserOutlined />} 
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input 
            prefix={<MailOutlined />} 
            placeholder="Enter your email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
            autoComplete="new-password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
            size="large"
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

  const tabItems = [
    {
      key: "login",
      label: "Login",
      children: loginTab,
    },
    {
      key: "register",
      label: "Register",
      children: registerTab,
    },
  ];

  return (
    <Modal
      title={
        <div className="text-center py-2">
          <h2 className="text-xl font-semibold mb-0">Welcome!</h2>
          <p className="text-gray-500 text-sm mb-0">
            Please login to create your QR code
          </p>
        </div>
      }
      open={open}
      onCancel={handleModalClose}
      footer={null}
      width={400}
      centered
      maskClosable={false}
      destroyOnClose={true} // Modal kapandığında içeriği temizle
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        centered
        items={tabItems}
        size="large"
      />
    </Modal>
  );
};

export default LoginPopup;