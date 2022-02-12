import React, { useState, useEffect } from "react";
// Antd
import { Layout, Avatar, Menu, Popconfirm, message, Badge } from "antd";
import {
  WechatOutlined,
  SettingOutlined,
  MessageOutlined,
} from "@ant-design/icons";
// Redux
import { useSelector } from "react-redux";

// Router
import { useHistory, Link } from "react-router-dom";

// Socket
import socket from "../../utils/socket";

// Axios
import instance from "../../utils/request";

// Token
import { clearToken } from "../../utils/auth";

// Static
import logo from "../../images/logo_top_bar.png";
import { updateUser } from "../../services/user";

const { Header } = Layout;
const { SubMenu } = Menu;

function TopBar() {
  // Router
  const history = useHistory();

  const user = useSelector((state) => state);
  const [newMessage, setNewMessage] = useState(false);
  const [newNotification, setNewNotification] = useState(false);

  // eslint-disable-next-line consistent-return
  const updateReadMessage = (bool) => {
    try {
      updateUser(user.id, { hasNewMessage: bool });
    } catch (err) {
      return err;
    }
  };

  // eslint-disable-next-line consistent-return
  const updateReadNotification = (bool) => {
    try {
      updateUser(user.id, { hasNewNotification: bool });
    } catch (err) {
      return err;
    }
  };

  const confirmLogout = () => {
    clearToken();
    history.push("/login");
    message.success("Logout Successfully!");
    socket.emit("logout", user.id);
  };

  const handleChatClick = () => {
    if (history.location.pathname !== "/user/chat") {
      setNewMessage(false);
      updateReadMessage(false);
      history.push("/user/chat");
    }
  };

  const handleNotificationClick = () => {
    if (history.location.pathname !== "/user/notification") {
      setNewNotification(false);
      updateReadNotification(false);
      history.push("/user/notification");
    }
  };

  useEffect(() => {
    instance.get(`/api/user`).then((res) => {
      setNewMessage(res.data.hasNewMessage);
    });
    instance.get(`/api/user`).then((res) => {
      setNewNotification(res.data.hasNewNotification);
    });
    socket.on("getMessage", () => {
      if (history.location.pathname === "/user/chat") {
        if (newMessage !== false) {
          setNewMessage(false);
          updateReadMessage(false);
        }
      } else if (newMessage !== true) {
        // code updated here
        setNewMessage(true);
      }
    });
    socket.on("getNotification", () => {
      if (history.location.pathname === "/user/notification") {
        if (newNotification !== false) {
          setNewNotification(false);
          updateReadNotification(false);
        }
      } else if (newNotification !== true) {
        // code updated here
        setNewNotification(true);
      }
    });
  }, []);

  return (
    <div>
      <Header
        style={{
          position: "fixed",
          zIndex: 1,
          width: "100%",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="logo">
          <Link to="/user/home">
            <img
              src={logo}
              alt="logo"
              style={{
                width: "168px",
                height: "64px",
                float: "left",
              }}
            />
          </Link>
        </div>
        <Menu mode="horizontal">
          <Menu.Item
            key="chat"
            icon={<WechatOutlined />}
            style={{ marginLeft: "auto" }}
            onClick={() => handleChatClick()}
          >
            <Badge dot={newMessage}>Chat</Badge>
          </Menu.Item>
          <Menu.Item
            key="notification"
            icon={<MessageOutlined />}
            onClick={() => handleNotificationClick()}
          >
            <Badge dot={newNotification}>Notification</Badge>
          </Menu.Item>
          <SubMenu key="settings" icon={<SettingOutlined />} title="Account">
            <Menu.ItemGroup title="Personal Profile">
              <Menu.Item
                key="setting:1"
                onClick={() => {
                  history.push("/user/group");
                }}
              >
                Groups
              </Menu.Item>
              <Menu.Item
                key="setting:2"
                onClick={() => {
                  history.push(`/user/${user.id}`);
                }}
              >
                Posts
              </Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Account Settings">
              <Menu.Item
                key="setting:3"
                onClick={() => {
                  history.push("/user/settings");
                }}
              >
                Change Settings
              </Menu.Item>
              <Popconfirm
                title="Are you sure you want to logout?"
                onConfirm={confirmLogout}
              >
                <Menu.Item key="setting:4">Logout</Menu.Item>
              </Popconfirm>
            </Menu.ItemGroup>
          </SubMenu>
          <Menu.Item key="avatar">
            <Avatar src={user.avatarUrl} />
            <span id="homeUsername">{user.name}</span>
          </Menu.Item>
        </Menu>
      </Header>
    </div>
  );
}

export default TopBar;
