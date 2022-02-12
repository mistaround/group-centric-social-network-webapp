import React from "react";

// Antd
import { Form, Input, Button, Card, Row, Col, notification } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

// Router
import { useHistory, Link } from "react-router-dom";

// Auth and Token
import { setToken } from "../utils/auth";
import { userLogin } from "../services/auth";

// Static
import backgroundImg from "../images/login-background.jpg";
import "./Login.css";
import logo from "../images/logo.png";

export default function Login() {
  // Router
  const history = useHistory();

  // After user press login button
  const onFinish = async (values) => {
    // Call login API
    try {
      const response = await userLogin({
        name: values.username,
        password: values.password,
      });

      // If backend gives successful feedback
      if (response.success) {
        setToken(response.token);
        notification.success({
          message: "Login Successful",
          description: `Welcome back. What do you want to show us today :)`,
        });
        history.push("/user/home");
      }
      return response;
    } catch (err) {
      if (err.response.status === 429) {
        return notification.error({
          message: "Login Failed",
          description:
            "Your account has been temporarily locked. Please retry after one minute.",
        });
      }
      notification.error({
        message: "Login Failed",
        description: "Invalid username or password.",
      });
      return err;
    }
  };

  return (
    <Row>
      <Col span={12}>
        <img
          style={{ width: "100%", height: "100%" }}
          src={backgroundImg}
          alt="Missing Pic"
        />
      </Col>
      <Col className="login-form-background" span={12}>
        <Row>
          <Col span={4} />
          <Col span={16}>
            <img
              src={logo}
              alt="logo"
              style={{
                width: "90%",
                height: "85%",
              }}
            />
          </Col>
          <Col span={4} />
        </Row>
        <Row>
          <Card
            title="Sign in"
            bordered={false}
            className="login-form-container"
          >
            <Form
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                  id="nameInpt"
                  allowClear
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Please input your Password!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                  id="pwsInpt"
                  allowClear
                />
              </Form.Item>

              <Form.Item style={{ textAlign: "center" }}>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  id="loginBtn"
                  className="login-form-button"
                >
                  Sign in
                </Button>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                  No account? <Link to="/register">Sign up</Link>
                </div>
              </Form.Item>
            </Form>
          </Card>
        </Row>
      </Col>
    </Row>
  );
}
