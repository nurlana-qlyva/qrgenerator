import Link from "next/link";
import { Button, Dropdown, Typography } from "antd";
import { LogoutOutlined, LoginOutlined, UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Avatar = ({ user, setIsModalOpen, onLogout }) => {
  const handleLogout = () => {
    localStorage.removeItem("auth");
    if (onLogout) {
      onLogout();
    }
  };

  const userDropdownItems = [
    {
      key: "user-info",
      label: (
        <div style={{ padding: "8px 0" }}>
          <Text strong>{user?.name || user?.email}</Text>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  // Dropdown menu items for guests
  const guestDropdownItems = [
    {
      key: "login",
      label: (
        <Button
          type="text"
          onClick={() => setIsModalOpen(true)}
          style={{ padding: 0, height: "auto" }}
        >
          Login
        </Button>
      ),
      icon: <LoginOutlined />,
    },
    {
      key: "register",
      label: <Link href="/register">Register</Link>,
      icon: <UserOutlined />,
    },
  ];

  const getUserInitial = () => {
    if (user?.Name) {
      return user.Name.charAt(0).toUpperCase();
    }
    if (user?.Email) {
      return user.Email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Dropdown
      menu={{
        items: user ? userDropdownItems : guestDropdownItems,
      }}
      placement="bottomRight"
      trigger={["click"]}
    >
      <Button
        type="text"
        style={{
          border: "none",
          boxShadow: "none",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {user ? (
          <div
            className={`w-12 h-12 rounded-xl bg-[#1d59f9]  flex items-center justify-center text-white text-xl font-bold shadow-lg`}
          >
            {getUserInitial()}
          </div>
        ) : (
          <div
            className={`w-12 h-12 rounded-xl bg-[#1d59f9]  flex items-center justify-center text-white text-xl font-bold shadow-lg`}
          >
            <UserOutlined color="#fff" />
          </div>
        )}
      </Button>
    </Dropdown>
  );
};

export default Avatar;
